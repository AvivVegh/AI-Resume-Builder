import { DataSource } from 'typeorm';
import { getConnetionConfig } from './data-source';

export default new DataSource(getConnetionConfig());
