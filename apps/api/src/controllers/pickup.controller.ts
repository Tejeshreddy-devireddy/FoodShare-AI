import { Response } from 'express';
import { Types } from 'mongoose';
import { Pickup } from '../models/Pickup';
import { Donation } from '../models/Donation';
import { User } from '../models/User';
import { AuthRequest } from '../middleware/auth';
import { getSocketIo } from '../sockets/socket';

export const createPickup = async (req: AuthRequest, res: Response) => {
  try {
    const { donationId } = req.body;
    if (!donationId) {
      return res.status(400).json({ error: 'Donation ID is required' });
    }

    const donation = await Donation.findById(donationId);
    if (!donation) {
      return res.status(404).json({ error: 'Donation not found' });
    }

    // Check authorization (NGO matches matchedNgo, or Admin)
    if (req.user?.role !== 'Admin') {
      if (!donation.matchedNgo || donation.matchedNgo.toString() !== req.user?.id) {
        return res.status(403).json({ error: 'You are not authorized to create a pickup task for this donation' });
      }
    }

    const existingPickup = await Pickup.findOne({ donation: donationId });
    if (existingPickup) {
      return res.status(400).json({ error: 'Pickup task already exists for this donation' });
    }

    const verificationOtp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit verification code
    const verificationQrHash = donation.qrCodeHash || 'mockqrcodehash';

    const pickup = new Pickup({
      donation: donationId,
      ngo: donation.matchedNgo || req.user?.id,
      status: 'pending',
      verificationOtp,
      verificationQrHash,
    });

    await pickup.save();
    res.status(201).json({ message: 'Pickup task created successfully', pickup });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Server error' });
  }
};

export const assignVolunteer = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'Volunteer') {
      return res.status(403).json({ error: 'Only volunteers can accept pickup tasks' });
    }

    const pickup = await Pickup.findById(req.params.id);
    if (!pickup) {
      return res.status(404).json({ error: 'Pickup task not found' });
    }

    if (pickup.volunteer) {
      return res.status(400).json({ error: 'Task already assigned to another volunteer' });
    }

    pickup.volunteer = new Types.ObjectId(req.user.id);
    pickup.status = 'assigned';
    await pickup.save();

    await Donation.findByIdAndUpdate(pickup.donation, { status: 'claimed' });

    res.json({ message: 'Task assigned successfully', pickup });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Server error' });
  }
};

export const updateLocation = async (req: AuthRequest, res: Response) => {
  try {
    const { lat, lng, description } = req.body;
    if (lat === undefined || lng === undefined) {
      return res.status(400).json({ error: 'Latitude and longitude coordinates are required' });
    }

    const pickup = await Pickup.findById(req.params.id);
    if (!pickup) {
      return res.status(404).json({ error: 'Pickup task not found' });
    }

    pickup.trackingPath.push({
      coordinates: [lng, lat],
      timestamp: new Date(),
      description: description || 'Vehicle tracking update'
    });

    await pickup.save();

    // Broadcast update via socket
    const io = getSocketIo();
    if (io) {
      io.to(`pickup_${pickup._id}`).emit('location_update', {
        pickupId: pickup._id,
        coordinates: [lng, lat],
        description
      });
    }

    res.json({ message: 'Location updated successfully', trackingPath: pickup.trackingPath });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Server error' });
  }
};

export const completePickup = async (req: AuthRequest, res: Response) => {
  try {
    const { otp, qrHash, deliveryProofImage, deliveryNote } = req.body;
    const pickup = await Pickup.findById(req.params.id);
    if (!pickup) {
      return res.status(404).json({ error: 'Pickup task not found' });
    }

    // Verify requesting user is the assigned volunteer or Admin
    if ((!pickup.volunteer || pickup.volunteer.toString() !== req.user?.id) && req.user?.role !== 'Admin') {
      return res.status(403).json({ error: 'Not authorized to complete this pickup' });
    }

    // Verify via OTP or QR
    if (otp) {
      if (pickup.verificationOtp !== otp) {
        return res.status(400).json({ error: 'Invalid verification OTP' });
      }
    } else if (qrHash) {
      if (pickup.verificationQrHash !== qrHash) {
        return res.status(400).json({ error: 'Invalid verification QR Code' });
      }
    } else {
      return res.status(400).json({ error: 'Verification OTP or QR Code is required' });
    }

    pickup.status = 'delivered';
    pickup.deliveryProofImage = deliveryProofImage || 'mock_proof.jpg';
    pickup.deliveryNote = deliveryNote;
    pickup.completedAt = new Date();
    await pickup.save();

    // Mark donation as completed
    await Donation.findByIdAndUpdate(pickup.donation, { status: 'completed' });

    // Grant points to volunteer
    if (pickup.volunteer) {
      await User.findByIdAndUpdate(pickup.volunteer, {
        $inc: { 'stats.points': 100 } // reward points
      });
    }

    res.json({ message: 'Pickup task marked completed successfully', pickup });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Server error' });
  }
};

export const getPickups = async (req: AuthRequest, res: Response) => {
  try {
    const query: any = {};
    if (req.user?.role === 'Volunteer') {
      query.volunteer = req.user.id;
    } else if (req.user?.role === 'NGO') {
      query.ngo = req.user.id;
    }
    const pickups = await Pickup.find(query)
      .populate({
        path: 'donation',
        populate: { path: 'donor', select: 'name email location donorDetails' }
      })
      .populate('ngo', 'name email location ngoDetails')
      .populate('volunteer', 'name email status stats');

    res.json(pickups);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Server error' });
  }
};
