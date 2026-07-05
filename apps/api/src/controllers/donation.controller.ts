import { Response } from 'express';
import { Types } from 'mongoose';
import { Donation } from '../models/Donation';
import { User } from '../models/User';
import { AuthRequest } from '../middleware/auth';
import crypto from 'crypto';

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

export const createDonation = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'Donor') {
      return res.status(403).json({ error: 'Only Donors can create donations' });
    }

    const { foodItems, description, expiryTime, pickupWindowStart, pickupWindowEnd, location, address, image } = req.body;

    if (!foodItems || foodItems.length === 0 || !location) {
      return res.status(400).json({ error: 'Food items and location coordinates are required' });
    }

    // Call FastAPI AI Service for image freshness detection if image is provided
    let freshnessScore = 95; // Default fallback
    let shelfLifeHours = 12;  // Default fallback

    if (image) {
      // VULN-15: Validate image size (2MB base64 limit)
      const approxSizeInMB = (image.length * 3) / (4 * 1024 * 1024);
      if (approxSizeInMB > 2) {
        return res.status(400).json({ error: 'Image size exceeds maximum limit of 2MB' });
      }

      // Validate image format
      const base64Regex = /^data:image\/(png|jpeg|jpg|webp);base64,/;
      if (!base64Regex.test(image)) {
        return res.status(400).json({ error: 'Invalid image format. Only PNG, JPEG, JPG, and WEBP base64 formats are allowed.' });
      }

      try {
        const response = await fetch(`${AI_SERVICE_URL}/ai/freshness`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'X-AI-API-KEY': process.env.AI_API_KEY || 'supersecretaiapikeyforfoodsharedevelopment'
          },
          body: JSON.stringify({ image_data: image })
        });
        if (response.ok) {
          const result = await response.json() as any;
          freshnessScore = result.freshness_score || 95;
          shelfLifeHours = result.predicted_shelf_life_hours || 12;
        }
      } catch (err) {
        console.warn('AI Service is unavailable. Using default safety evaluation: ', err);
      }
    }

    // Generate unique QR Hash for pickup validation
    const qrCodeHash = crypto.createHash('sha256').update(Date.now().toString() + req.user.id).digest('hex');

    // Calculate CO2 reduction calculation (e.g. 2.5kg CO2 saved per kg of food)
    let totalWeight = 0;
    foodItems.forEach((item: any) => {
      if (item.unit === 'kg') {
        totalWeight += item.quantity;
      } else {
        totalWeight += item.quantity * 0.4; // roughly 400g per serving/unit
      }
    });
    const carbonSaved = Math.round(totalWeight * 2.5 * 100) / 100;
    const waterSaved = Math.round(totalWeight * 150); // 150 liters saved per kg

    const donation = new Donation({
      donor: req.user.id,
      foodItems,
      description,
      freshnessScore,
      shelfLifeHours,
      images: image ? [image] : [],
      expiryTime,
      pickupWindowStart,
      pickupWindowEnd,
      location: {
        type: 'Point',
        coordinates: location.coordinates // [longitude, latitude]
      },
      address,
      qrCodeHash,
      carbonSavedCalculation: carbonSaved,
    });

    await donation.save();

    // Increment donor stats
    await User.findByIdAndUpdate(req.user.id, {
      $inc: {
        'stats.mealsSaved': Math.round(totalWeight * 2.5),
        'stats.carbonSaved': carbonSaved,
        'stats.waterSaved': waterSaved,
      }
    });

    res.status(201).json({
      message: 'Donation created successfully',
      donation
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Server error' });
  }
};

export const getDonations = async (req: AuthRequest, res: Response) => {
  try {
    const { status, lat, lng, distance = 10000 } = req.query; // distance in meters, default 10km
    const query: any = {};

    if (status) {
      query.status = status;
    }

    if (lat && lng) {
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng as string), parseFloat(lat as string)],
          },
          $maxDistance: Number(distance),
        },
      };
    }

    const donations = await Donation.find(query).populate('donor', 'name email location donorDetails').sort({ createdAt: -1 });
    res.json(donations);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Server error' });
  }
};

export const getDonationById = async (req: AuthRequest, res: Response) => {
  try {
    const donation = await Donation.findById(req.params.id)
      .populate('donor', 'name email location donorDetails stats')
      .populate('matchedNgo', 'name email location ngoDetails');
    if (!donation) {
      return res.status(404).json({ error: 'Donation not found' });
    }
    res.json(donation);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Server error' });
  }
};

export const claimDonation = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'NGO') {
      return res.status(403).json({ error: 'Only NGOs can claim donations' });
    }

    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ error: 'Donation not found' });
    }

    if (donation.status !== 'available') {
      return res.status(400).json({ error: 'Donation is no longer available' });
    }

    donation.status = 'claimed';
    donation.matchedNgo = new Types.ObjectId(req.user.id);
    await donation.save();

    res.json({ message: 'Donation claimed successfully', donation });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Server error' });
  }
};

export const getAiFreshness = async (req: AuthRequest, res: Response) => {
  try {
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ error: 'Image is required' });
    }

    // VULN-15: Validate image size (2MB base64 limit)
    const approxSizeInMB = (image.length * 3) / (4 * 1024 * 1024);
    if (approxSizeInMB > 2) {
      return res.status(400).json({ error: 'Image size exceeds maximum limit of 2MB' });
    }

    // Validate image format
    const base64Regex = /^data:image\/(png|jpeg|jpg|webp);base64,/;
    if (!base64Regex.test(image)) {
      return res.status(400).json({ error: 'Invalid image format. Only PNG, JPEG, JPG, and WEBP base64 formats are allowed.' });
    }

    const response = await fetch(`${AI_SERVICE_URL}/ai/freshness`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-AI-API-KEY': process.env.AI_API_KEY || 'supersecretaiapikeyforfoodsharedevelopment'
      },
      body: JSON.stringify({ image_data: image })
    });

    if (response.ok) {
      const result = await response.json();
      return res.json(result);
    } else {
      const errDetail = await response.text();
      return res.status(500).json({ error: 'AI Service error', detail: errDetail });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Server error' });
  }
};

