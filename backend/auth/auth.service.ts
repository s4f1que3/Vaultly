import { supabaseAdminService } from '@/supabase/supabase_admin.service';
import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException,} from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class AuthService {
  constructor(private readonly supabase: supabaseAdminService){}

  async checkEmailExists(email: string): Promise<void> {
    const { data, error } = await this.supabase.db.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });

    if (error) throw new InternalServerErrorException('Failed to verify email');

    const exists = data.users.some(
      (u) => u.email?.toLowerCase() === email.toLowerCase(),
    );

    if (!exists) throw new NotFoundException('No account found with this email address');
  }

  async changeEmail(
    userId: string,
    currentEmail: string,
    password: string,
    newEmail: string,
  ): Promise<void> {
    // Verify current email matches authenticated user
    const { data: userData, error: getUserError } =
      await this.supabase.db.auth.admin.getUserById(userId);

    if (getUserError || !userData.user) {
      throw new UnauthorizedException('User not found');
    }

    if (userData.user.email?.toLowerCase() !== currentEmail.toLowerCase()) {
      throw new UnauthorizedException('Current email is incorrect');
    }

    // Verify password by attempting sign-in
    const { error: signInError } = await this.supabase.db.auth.signInWithPassword({
      email: currentEmail,
      password,
    });

    if (signInError) {
      throw new UnauthorizedException('Incorrect password');
    }

    // Update email immediately (admin bypasses confirmation email)
    const { error: updateError } = await this.supabase.db.auth.admin.updateUserById(
      userId,
      { email: newEmail, email_confirm: true },
    );

    if (updateError) throw new InternalServerErrorException(updateError.message);
  }
}
