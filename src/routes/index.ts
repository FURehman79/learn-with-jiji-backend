import { Router } from 'express';
import jijiController from '../controllers/jijiController';
import { optionalAuth } from '../middlewares/auth';
import { askJijiValidation } from '../middlewares/validation';
import { asyncHandler } from '../middlewares/errorHandler';

const router = Router();

/**
 * @route   POST /api/v1/ask-jiji
 * @desc    Ask Jiji a question and get relevant learning resources
 * @access  Public (but tracks user if authenticated)
 */
router.post(
  '/ask-jiji',
  optionalAuth,
  askJijiValidation,
  asyncHandler(jijiController.askJiji.bind(jijiController))
);

/**
 * @route   GET /api/v1/health
 * @desc    Health check endpoint
 * @access  Public
 */
router.get(
  '/health',
  asyncHandler(jijiController.healthCheck.bind(jijiController))
);

export default router;
