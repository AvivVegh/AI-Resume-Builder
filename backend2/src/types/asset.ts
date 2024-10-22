import { S3 } from 'aws-sdk';
import { default as joi } from 'joi';

import { InterfaceFrom, toJoiObject } from './joi-util';

export enum DocumentType {
  TRANSCRIPT = 'transcript',
  FINANCIAL_AID_AWARD_LETTER = 'financialAidAwardLetter',
  EMPLOYMENT_AUTHORIZATION_DOCUMENT = 'employmentAuthorizationDocument',
  STUDENT_AID_REPORT = 'studentAidReport',
  THANK_YOU_LETTER_VIDEO = 'thankYouLetterVideo',
  ENROLLMENT_VERFICATION = 'enrollmentVerification',
  PUBLIC_EVENT_IMAGE = 'publicEventImage',
  IMAGE = 'image',
  HEADSHOT = 'headshot',
  RESUME = 'resume',
  SAT = 'sat',
  ACT = 'act',
  IB_EXAM = 'ibExam',
  AP_EXAM = 'apExam',
  GENERIC = 'generic',
}

export enum DocumentVerificationStatus {
  NOT_STARTED = 'notStarted',
  NEEDS_REVIEW = 'needsReview',
  PENDING_VERIFICATION = 'pendingVerification',
  NOT_VERIFIED = 'notVerified',
  VERIFIED = 'verified',
  NEEDS_REUPLOAD = 'needsReupload',
  NEEDS_CORRECTION = 'needsCorrection',
  IN_PROGRESS = 'inProgress',
  COMPLETED = 'completed',
}

export enum DocumentRequestType {
  ISIR = 'isir',
  CLEARING_HOUSE = 'clearinghouse',
}

export enum DocumentStatus {
  OFFICIAL = 'official',
  UNOFFICIAL = 'unofficial',
}

export enum DocumentEnrollmentVerificationFormType {
  NATIONAL_STUDENT_CLEARING_HOUSE = 'National Student Clearing House',
  INSTITUTIONAL_VERIFICATION_FORM = 'Institutional Verification Form',
  HSF_FORM = 'HSF Form',
}

export interface IFile {
  contents: any;
  name: string;
  contentType: string;
  contentLength: number;
  documentType: DocumentType;
}

export type DocumentWithVerificationStatus = {
  userId: string;
  id?: string;
  status?: DocumentVerificationStatus;
};

const getFileRequest = {
  id: joi.string().required(),
  download: joi.boolean().default(false).optional(),
};

export const getFileRequestSchema = toJoiObject({ ...getFileRequest }).required();
export const getFileRequestSchemaKeys = Object.keys(getFileRequest);
export type IGetFileRequest = InterfaceFrom<typeof getFileRequestSchema>;

export interface IStudentUpload {
  id: string;
  fileName: string;
}
export interface IUserStageDocStudentUpload {
  userStageDocumentId: string;
}

export interface IDocStudent {
  fileUpload: (IStudentUpload | IUserStageDocStudentUpload)[];
  documentType: DocumentType;
  [key: string]: any;
}

export interface IFormPayloadStudent {
  [key: string]: IDocStudent;
}

export interface IDocTechnician {
  id: string;
  documentType: DocumentType;
  status: DocumentVerificationStatus;
  comments: string;
  metadata: any;
  verifications: any;
  isEvaluationRequired?: boolean;
}

export interface IFormPayloadTechnician extends Array<IDocTechnician> {
  [index: number]: IDocTechnician;
}

const deleteFilesRequest = {
  files: joi.any().required(),
  userGroups: joi.array().required(),
};

export const deleteFilesRequestSchema = toJoiObject({ ...deleteFilesRequest }).required();
export const deleteFilesRequestSchemaKeys = Object.keys(deleteFilesRequest);
export type IDeleteFilesRequest = InterfaceFrom<typeof deleteFilesRequestSchema>;

const deleteFolderRequest = {
  path: joi.string().required(),
  userEmail: joi.string().email().required(),
  userGroups: joi.array().required(),
};

export const deleteFolderRequestSchema = toJoiObject({ ...deleteFolderRequest }).required();
export const deleteFolderRequestSchemaKeys = Object.keys(deleteFolderRequest);
export type IDeleteFolderRequest = InterfaceFrom<typeof deleteFolderRequestSchema>;

const updateFileRequest = {
  id: joi.string().required(),
  event: joi.any().required(),
};

export const updateFileRequestSchema = toJoiObject({ ...updateFileRequest }).required();
export const updateFileRequestSchemaKeys = Object.keys(updateFileRequest);
export type IUpdateFileRequest = InterfaceFrom<typeof updateFileRequestSchema>;

const getAssetsRequest = {
  path: joi.string().optional(),
};

export const getAssetsRequestSchema = toJoiObject({ ...getAssetsRequest }).required();
export const getAssetsRequestSchemaKeys = Object.keys(getAssetsRequest);
export type IGetAssetsRequest = InterfaceFrom<typeof getAssetsRequestSchema>;

export interface IFileResponse {
  body?: any;
  contentType?: string;
  contentDisposition?: string;
  url?: string;
  fileName?: string;
}

export interface IGetAssetsResponseItem {
  id: string;
  fileName: string;
  filePath: string;
  url: string;
  shortUrl: string;
  userEmail: string;
  size: number;
  contentType: string;
  createdAt: Date;
}

export interface IGetAssetsResponse {
  assets: IGetAssetsResponseItem[];
  totalCount: number;
}

const uploadFileRequest = {
  userId: joi.string().guid().required(),
  event: joi.any().required(),
  fileName: joi.string().required(),
  fileContentType: joi.string().required(),
  size: joi.number().required(),
  userEmail: joi.string().email().required(),
  filePath: joi.string().required(),
};

export const uploadFileRequestSchema = toJoiObject({ ...uploadFileRequest }).required();
export const uploadFileRequestSchemaKeys = Object.keys(uploadFileRequest);
export type IUploadFileRequest = InterfaceFrom<typeof uploadFileRequestSchema>;

const getPresignedUploadUrlRequest = {
  fileName: joi.string().required(),
  filePath: joi.string().required(),
  contentType: joi.string().required(),
};

export const getPresignedUploadUrlRequestSchema = toJoiObject({ ...getPresignedUploadUrlRequest }).required();
export const getPresignedUploadUrlRequestSchemaKeys = Object.keys(getPresignedUploadUrlRequest);
export type IGetPresignedUploadUrlRequest = InterfaceFrom<typeof getPresignedUploadUrlRequestSchema>;

const createFolderRequest = {
  folderName: joi.string().required(),
  filePath: joi.string().required(),
  userGroups: joi.array().required(),
  userEmail: joi.string().email().required(),
};

export const createFolderRequestSchema = toJoiObject({ ...createFolderRequest }).required();
export const createFolderRequestSchemaKeys = Object.keys(createFolderRequest);
export type ICreateFolderRequest = InterfaceFrom<typeof createFolderRequestSchema>;

export interface IGetPresignedUploadUrlResponse {
  preSignedUrl: S3.PresignedPost;
}

export interface IGetPresignedUrlResponse {
  preSignedUrl: string;
}

const isirResponseFileRequest = {
  file: joi.string().base64().required(),
};

export const isirResponseFileRequestSchema = toJoiObject({ ...isirResponseFileRequest }).required();
export const isirResponseFileRequestSchemaKeys = Object.keys(isirResponseFileRequest);
export type IIsirResponseFileRequest = InterfaceFrom<typeof isirResponseFileRequestSchema>;

const satActScoresRequest = {
  studentId: joi.string().guid().required(),
};

export const satActScoresRequestSchema = toJoiObject({ ...satActScoresRequest }).required();
export const satActScoresRequestSchemaKeys = Object.keys(satActScoresRequest);
export type ISatActScoresRequest = InterfaceFrom<typeof satActScoresRequestSchema>;

const writeSatActScoresRequest = {
  scores: joi
    .array()
    .items(
      joi.object({
        studentId: joi.string().guid().required(),
        satEbrwScore: joi.number(),
        satMathScore: joi.number(),
        satTotalScore: joi.number(),
        actScore: joi.number(),
        americanCollegeTestingId: joi.string(),
        collegeBoardId: joi.string(),
      })
    )
    .required(),
};

export const writeSatActScoresRequestSchema = toJoiObject({ ...writeSatActScoresRequest }).required();
export const writeSatActScoresRequestSchemaKeys = Object.keys(writeSatActScoresRequest);
export type IWriteSatActScoresRequest = InterfaceFrom<typeof writeSatActScoresRequestSchema>;

export interface IAdminDocumentResponseItem {
  documentId: string;
}
export interface IAdminDocumentResponse {
  requestDocumentIds: IAdminDocumentResponseItem[];
  totalCount: number;
}

const getClearingHouseRequest = {
  studentId: joi.string().guid().required(),
};

export const getClearingHouseRequestSchema = toJoiObject({ ...getClearingHouseRequest }).required();
export const getClearingHouseRequestSchemaKeys = Object.keys(getClearingHouseRequest);
export type IGetClearingHouse = InterfaceFrom<typeof getClearingHouseRequestSchema>;

export interface AssetVerifications {
  studentNameDoesNotMatch?: boolean;
  institutionNameDoesNotMatch?: boolean;
  institutionNameDoesNotMatchTranscript?: boolean;
  institutionNameDoesNotMatchCLInstitution?: boolean;
}
