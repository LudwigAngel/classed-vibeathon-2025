import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_OAUTH_REDIRECT_URI, GOOGLE_SCOPES } from './google.constants';

@Injectable()
export class GoogleService {
  getOAuth2Client() {
    const client = new google.auth.OAuth2(
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET,
      GOOGLE_OAUTH_REDIRECT_URI,
    );
    return client;
  }

  generateAuthUrl() {
    console.log('GOOGLE_CLIENT_ID:', GOOGLE_CLIENT_ID ? `SET (length: ${GOOGLE_CLIENT_ID.length})` : 'NOT SET');
    console.log('GOOGLE_CLIENT_SECRET:', GOOGLE_CLIENT_SECRET ? `SET (length: ${GOOGLE_CLIENT_SECRET.length})` : 'NOT SET');
    console.log('GOOGLE_OAUTH_REDIRECT_URI:', GOOGLE_OAUTH_REDIRECT_URI);
    console.log('GOOGLE_SCOPES:', GOOGLE_SCOPES);
    
    // Verificar si hay caracteres extraños
    console.log('CLIENT_ID raw:', JSON.stringify(GOOGLE_CLIENT_ID));
    
    const oauth2Client = this.getOAuth2Client();
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: GOOGLE_SCOPES,
      prompt: 'consent',
    });
    
    console.log('Generated auth URL:', authUrl);
    return authUrl;
  }

  classroom(auth: any) {
    return google.classroom({ version: 'v1', auth });
  }

  calendar(auth: any) {
    return google.calendar({ version: 'v3', auth });
  }
}
