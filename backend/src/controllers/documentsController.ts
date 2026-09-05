import { Response } from 'express';
import pool from '../config/database';
import { bucket } from '../config/storage';
import { AuthenticatedRequest } from '../middleware/auth';
import { v4 as uuidv4 } from 'uuid';

const ALLOWED_DOCUMENT_TYPES = [
  'government_id',
  'resume',
  'nbi_clearance',
  'educational_documents',
  'skills_tesda_certification',
  'medical_exam_results',
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const listDocuments = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const result = await pool.query(
      'SELECT * FROM candidate_documents WHERE user_id = $1 ORDER BY uploaded_at DESC',
      [req.userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
};

export const uploadDocument = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const { document_type } = req.body;

    if (!document_type || !ALLOWED_DOCUMENT_TYPES.includes(document_type)) {
      return res.status(400).json({ 
        error: 'Invalid document type',
        allowedTypes: ALLOWED_DOCUMENT_TYPES 
      });
    }

    if (req.file.size > MAX_FILE_SIZE) {
      return res.status(400).json({ error: 'File size exceeds 10MB limit' });
    }

    // Validate file type
    const allowedMimeTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/jpg',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!allowedMimeTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ 
        error: 'Invalid file type. Allowed: PDF, DOC, DOCX, JPG, PNG' 
      });
    }

    const fileExt = req.file.originalname.split('.').pop();
    const filePath = `${req.userId}/${document_type}.${fileExt}`;

    // Upload to Cloud Storage
    const file = bucket.file(filePath);
    await file.save(req.file.buffer, {
      metadata: {
        contentType: req.file.mimetype,
      },
    });

    // Check if document record exists
    const existing = await pool.query(
      'SELECT id FROM candidate_documents WHERE user_id = $1 AND document_type = $2',
      [req.userId, document_type]
    );

    if (existing.rows.length > 0) {
      // Update existing record
      const result = await pool.query(
        `UPDATE candidate_documents SET
          file_name = $1,
          file_path = $2,
          file_size = $3,
          uploaded_at = now()
        WHERE user_id = $4 AND document_type = $5
        RETURNING *`,
        [req.file.originalname, filePath, req.file.size, req.userId, document_type]
      );
      res.json(result.rows[0]);
    } else {
      // Insert new record
      const result = await pool.query(
        `INSERT INTO candidate_documents (
          user_id, document_type, file_name, file_path, file_size
        ) VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
        [req.userId, document_type, req.file.originalname, filePath, req.file.size]
      );
      res.status(201).json(result.rows[0]);
    }
  } catch (error) {
    console.error('Error uploading document:', error);
    res.status(500).json({ error: 'Failed to upload document' });
  }
};

export const deleteDocument = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;

    // Get document to verify ownership and get file path
    const docResult = await pool.query(
      'SELECT * FROM candidate_documents WHERE id = $1 AND user_id = $2',
      [id, req.userId]
    );

    if (docResult.rows.length === 0) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const document = docResult.rows[0];

    // Delete from Cloud Storage
    try {
      const file = bucket.file(document.file_path);
      await file.delete();
    } catch (storageError) {
      console.error('Error deleting from storage:', storageError);
      // Continue with database deletion even if storage deletion fails
    }

    // Delete from database
    await pool.query(
      'DELETE FROM candidate_documents WHERE id = $1',
      [id]
    );

    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ error: 'Failed to delete document' });
  }
};

export const getDocumentDownloadUrl = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;

    // Get document to verify ownership
    const docResult = await pool.query(
      'SELECT * FROM candidate_documents WHERE id = $1 AND user_id = $2',
      [id, req.userId]
    );

    if (docResult.rows.length === 0) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const document = docResult.rows[0];

    // Generate signed URL (valid for 1 hour)
    const file = bucket.file(document.file_path);
    const [signedUrl] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 60 * 60 * 1000, // 1 hour
    });

    res.json({ url: signedUrl });
  } catch (error) {
    console.error('Error generating download URL:', error);
    res.status(500).json({ error: 'Failed to generate download URL' });
  }
};
