/**
 * @jest-environment jsdom
 */


import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const fetch = require('node-fetch');

global.fetch = fetch;
global.Headers = fetch.Headers;
global.Request = fetch.Request;
global.Response = fetch.Response;

import React from 'react';
import '@testing-library/jest-dom';