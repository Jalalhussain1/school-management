import { Request, Response } from 'express';
import { z } from 'zod';
import { db } from '../database/db';
import { Exam, ExamResult } from '../types';

const examCreateSchema = z.object({
  title: z.string().min(1),
  term: z.string().min(1),
  startDate: z.string(),
  endDate: z.string(),
  classes: z.array(z.string()).min(1),
  status: z.enum(['Upcoming', 'Ongoing', 'Completed', 'Published']),
  description: z.string().optional(),
});

const subjectMarkSchema = z.object({
  subjectCode: z.string(),
  subjectName: z.string(),
  maxMarks: z.number().positive(),
  obtainedMarks: z.number().nonnegative(),
});

const examResultSchema = z.object({
  id: z.string().optional(),
  examId: z.string(),
  studentId: z.string(),
  studentName: z.string(),
  rollNo: z.string(),
  admissionNo: z.string(),
  classId: z.string(),
  className: z.string(),
  marks: z.array(subjectMarkSchema),
  remarks: z.string().optional(),
});

const calculateGrade = (percentage: number): string => {
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B+';
  if (percentage >= 60) return 'B';
  if (percentage >= 50) return 'C';
  return 'F';
};

export const getExams = async (_req: Request, res: Response) => {
  const exams = db.getExams();
  return res.json({ success: true, total: exams.length, data: exams });
};

export const getExamById = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const exam = db.getExamById(id);

  if (!exam) {
    return res.status(404).json({ success: false, message: 'Exam not found' });
  }

  return res.json({ success: true, data: exam });
};

export const createExam = async (req: Request, res: Response) => {
  const data = examCreateSchema.parse(req.body);

  const newExam: Exam = {
    ...data,
    id: `ex-${Date.now()}`,
  };

  db.addExam(newExam);

  return res.status(201).json({
    success: true,
    message: `Exam "${newExam.title}" scheduled successfully`,
    data: newExam,
  });
};

export const updateExam = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const updated = db.updateExam(id, req.body);

  if (!updated) {
    return res.status(404).json({ success: false, message: 'Exam not found' });
  }

  return res.json({
    success: true,
    message: 'Exam schedule updated successfully',
    data: updated,
  });
};

export const deleteExam = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const success = db.deleteExam(id);

  if (!success) {
    return res.status(404).json({ success: false, message: 'Exam not found' });
  }

  return res.json({
    success: true,
    message: 'Exam deleted successfully',
  });
};

export const getExamResults = async (req: Request, res: Response) => {
  const { examId, studentId, classId } = req.query as Record<string, string>;

  let results = db.getExamResults();

  if (examId) {
    results = results.filter((r) => r.examId === examId);
  }

  if (studentId) {
    results = results.filter((r) => r.studentId === studentId);
  }

  if (classId && classId !== 'ALL') {
    results = results.filter((r) => r.classId === classId || r.className === classId);
  }

  return res.json({
    success: true,
    total: results.length,
    data: results,
  });
};

export const saveExamResult = async (req: Request, res: Response) => {
  const data = examResultSchema.parse(req.body);

  const totalMarks = data.marks.reduce((sum, m) => sum + m.maxMarks, 0);
  const obtainedTotal = data.marks.reduce((sum, m) => sum + m.obtainedMarks, 0);
  const percentage = totalMarks > 0 ? Number(((obtainedTotal / totalMarks) * 100).toFixed(1)) : 0;
  const grade = calculateGrade(percentage);
  const status = percentage >= 50 ? 'Passed' : 'Failed';

  const resultRecord: ExamResult = {
    id: data.id || `res-${Date.now()}`,
    examId: data.examId,
    studentId: data.studentId,
    studentName: data.studentName,
    rollNo: data.rollNo,
    admissionNo: data.admissionNo,
    classId: data.classId,
    className: data.className,
    marks: data.marks,
    totalMarks,
    obtainedTotal,
    percentage,
    grade,
    status,
    remarks: data.remarks,
  };

  db.saveExamResult(resultRecord);

  return res.json({
    success: true,
    message: `Exam marks saved for ${resultRecord.studentName}`,
    data: resultRecord,
  });
};
