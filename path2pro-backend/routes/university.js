import express from 'express';
import { getCountries, getUniversitiesByCountry } from '../controllers/universityController.js';

const router = express.Router();

// @route   GET /api/universities/countries
// @desc    Get list of countries
// @access  Public
router.get('/countries', getCountries);

// @route   GET /api/universities
// @desc    Get universities by country
// @access  Public
router.get('/', getUniversitiesByCountry);

export default router; 