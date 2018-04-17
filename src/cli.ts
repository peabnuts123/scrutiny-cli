#!/usr/bin/env node
import { argv } from 'yargs';

import scrutinyCli from '@app/index';

// Invoke CLI function with CLI arguments
scrutinyCli(...argv._);
