import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { GoogleService } from '../google/google.service';

@Controller('auth')
export class AuthController {
  constructor(private google: GoogleService) {}

  @Get('google')
  async loginWithGoogle(@Res() res: Response) {
    const url = this.google.generateAuthUrl();
    return res.redirect(url);
  }

  @Get('google/callback')
  async googleCallback(@Query('code') code: string, @Res() res: Response) {
    if (!code) return res.status(400).json({ error: 'Missing code' });

    try {
      const oauth2 = this.google.getOAuth2Client();
      const { tokens } = await oauth2.getToken(code);
      oauth2.setCredentials(tokens);

      // En producción, aquí persistirías los tokens y crearías una sesión/JWT
      console.log('Login exitoso:', {
        scopes: tokens.scope?.split(' ') || [],
        hasRefreshToken: Boolean(tokens.refresh_token),
        hasAccessToken: Boolean(tokens.access_token),
      });

      // Redirigir al frontend con éxito
      const frontendUrl = 'http://localhost:3000';
      return res.redirect(`${frontendUrl}?login=success`);
      
    } catch (error) {
      console.error('Error en OAuth callback:', error);
      const frontendUrl = 'http://localhost:3000';
      return res.redirect(`${frontendUrl}?login=error`);
    }
  }
}
