import { supabase, supabaseAdmin } from '../config/supabase';
import { Resource, Query } from '../types';
import logger from '../utils/logger';
import { AppError } from '../middlewares/errorHandler';

export class JijiService {
  /**
   * Search for relevant resources based on query keywords
   */
  async searchResources(queryText: string): Promise<Resource[]> {
    try {
      // Extract keywords from query (simple implementation)
      const keywords = this.extractKeywords(queryText);

      logger.debug('Searching resources with keywords', { keywords });

      // Search resources that match any of the keywords
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .contains('keywords', keywords)
        .limit(5);

      if (error) {
        logger.error('Error searching resources', { error });
        throw new AppError(
          'Failed to search resources',
          500,
          'SEARCH_FAILED'
        );
      }

      return data || [];
    } catch (error) {
      logger.error('Error in searchResources', { error });
      throw error;
    }
  }

  /**
   * Generate AI response (mocked for this assignment)
   */
  async generateResponse(queryText: string, resources: Resource[]): string {
    // This is a mocked AI response. In production, this would call an LLM API
    const resourceTypes = resources.map((r) => r.resource_type).join(', ');

    const responses = {
      rag: `RAG (Retrieval-Augmented Generation) is a technique that enhances AI responses by retrieving relevant information from a knowledge base before generating an answer. It combines the power of large language models with the accuracy of information retrieval systems.

Key benefits of RAG:
1. Improved accuracy through grounding in factual data
2. Ability to cite sources and provide references
3. Reduced hallucinations in AI responses
4. Dynamic knowledge updates without model retraining

I've found ${resources.length} relevant resource(s) to help you learn more about this topic.`,

      ai: `Artificial Intelligence (AI) refers to computer systems that can perform tasks that typically require human intelligence. This includes learning, reasoning, problem-solving, perception, and language understanding.

Modern AI includes:
- Machine Learning: Systems that learn from data
- Deep Learning: Neural networks with multiple layers
- Natural Language Processing: Understanding and generating human language
- Computer Vision: Interpreting visual information

Check out the resources below for a deeper dive into AI concepts.`,

      default: `Based on your query "${queryText}", I've found ${resources.length} relevant learning resource(s) that can help you understand this topic better. 

These materials include ${resourceTypes || 'comprehensive content'} designed to give you a thorough understanding of the subject. Feel free to explore them at your own pace!`,
    };

    // Simple keyword matching for demo
    const lowerQuery = queryText.toLowerCase();
    if (lowerQuery.includes('rag')) return responses.rag;
    if (lowerQuery.includes('ai') || lowerQuery.includes('artificial')) return responses.ai;
    
    return responses.default;
  }

  /**
   * Save query to database
   */
  async saveQuery(
    userId: string | undefined,
    queryText: string,
    responseText: string
  ): Promise<Query> {
    try {
      const queryData: any = {
        query_text: queryText,
        response_text: responseText,
      };

      // Only add user_id if user is authenticated
      if (userId) {
        queryData.user_id = userId;
      }

      const { data, error } = await supabaseAdmin
        .from('queries')
        .insert([queryData])
        .select()
        .single();

      if (error) {
        logger.error('Error saving query', { error });
        throw new AppError('Failed to save query', 500, 'SAVE_FAILED');
      }

      return data;
    } catch (error) {
      logger.error('Error in saveQuery', { error });
      throw error;
    }
  }

  /**
   * Get signed URL for storage files
   */
  async getSignedUrl(filePath: string): Promise<string> {
    try {
      const { data, error } = await supabase.storage
        .from('learning-resources')
        .createSignedUrl(filePath, 3600); // 1 hour expiry

      if (error) {
        logger.error('Error creating signed URL', { error, filePath });
        // Return the public URL as fallback
        const { data: publicData } = supabase.storage
          .from('learning-resources')
          .getPublicUrl(filePath);
        return publicData.publicUrl;
      }

      return data.signedUrl;
    } catch (error) {
      logger.error('Error in getSignedUrl', { error });
      throw error;
    }
  }

  /**
   * Extract keywords from query text (simple implementation)
   */
  private extractKeywords(text: string): string[] {
    // Simple keyword extraction - remove common words and split
    const commonWords = new Set([
      'what', 'is', 'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at',
      'to', 'for', 'of', 'with', 'by', 'from', 'about', 'explain', 'tell',
      'me', 'how', 'why', 'can', 'you', 'please', 'help',
    ]);

    return text
      .toLowerCase()
      .split(/\s+/)
      .filter((word) => !commonWords.has(word) && word.length > 2)
      .slice(0, 5); // Limit to 5 keywords
  }
}

export default new JijiService();
