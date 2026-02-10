import { Request, Response } from 'express';
import jijiService from '../services/jijiService';
import { AskJijiRequest, AskJijiResponse, ResourceResponse } from '../types';
import logger from '../utils/logger';

export class JijiController {
  /**
   * POST /api/v1/ask-jiji
   * Main endpoint to handle user queries
   */
  async askJiji(req: Request, res: Response): Promise<void> {
    try {
      const { query } = req.body as AskJijiRequest;
      const userId = req.user?.id;

      logger.info('Received query', { query, userId });

      // 1. Search for relevant resources
      const resources = await jijiService.searchResources(query);

      // 2. Generate AI response
      const answer = await jijiService.generateResponse(query, resources);

      // 3. Save query to database
      const savedQuery = await jijiService.saveQuery(userId, query, answer);

      // 4. Format resources for response
      const formattedResources: ResourceResponse[] = await Promise.all(
        resources.map(async (resource) => {
          const url = await jijiService.getSignedUrl(resource.file_url);
          return {
            id: resource.id,
            title: resource.title,
            description: resource.description,
            type: resource.resource_type,
            url,
          };
        })
      );

      // 5. Send response
      const response: AskJijiResponse = {
        success: true,
        data: {
          answer,
          resources: formattedResources,
          query_id: savedQuery.id,
        },
      };

      logger.info('Query processed successfully', {
        queryId: savedQuery.id,
        resourceCount: resources.length,
      });

      res.status(200).json(response);
    } catch (error) {
      logger.error('Error in askJiji', { error });
      throw error;
    }
  }

  /**
   * GET /api/v1/health
   * Health check endpoint
   */
  async healthCheck(req: Request, res: Response): Promise<void> {
    res.status(200).json({
      success: true,
      data: {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'Learn with Jiji Backend',
      },
    });
  }
}

export default new JijiController();
