import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IUserRepository } from '../repositories/interfaces';
import { RegisterDTO, LoginDTO, AuthResponseDTO, JwtPayload, CreateUserDTO } from '../dtos';
import { AppError } from '../errors/AppError';
import { UserRole } from '../models';

/**
 * AuthService — Handles user registration, login, and JWT management.
 * Demonstrates:
 *   - Encapsulation: private methods (hashPassword, comparePassword, generateToken)
 *   - Dependency Injection: IUserRepository injected via constructor
 *   - Single Responsibility: only authentication concerns
 */
export class AuthService {
  private readonly userRepository: IUserRepository;
  private readonly jwtSecret: string;
  private readonly jwtExpiresIn: string;
  private readonly saltRounds: number = 12;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
    this.jwtSecret = process.env.JWT_SECRET || 'fallback_secret';
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';
  }

  async register(data: RegisterDTO): Promise<AuthResponseDTO> {
    const existing = await this.userRepository.findByEmail(data.email);
    if (existing) {
      throw AppError.conflict('A user with this email already exists');
    }

    const passwordHash = await this.hashPassword(data.password);
    const createData: CreateUserDTO = {
      name: data.name,
      email: data.email,
      passwordHash,
      role: data.role || UserRole.MEMBER,
    };

    const user = await this.userRepository.create(createData);
    const token = this.generateToken({ 
      userId: user.id, 
      role: user.role,
      memberId: user.member?.id,
      librarianId: user.librarian?.id,
    });

    return {
      token,
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        memberId: user.member?.id,
        librarianId: user.librarian?.id,
      },
    };
  }

  async login(data: LoginDTO): Promise<AuthResponseDTO> {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw AppError.unauthorized('Invalid email or password');
    }

    if (!user.isActive) {
      throw AppError.forbidden('Your account has been deactivated');
    }

    const isValid = await this.comparePassword(data.password, user.passwordHash);
    if (!isValid) {
      throw AppError.unauthorized('Invalid email or password');
    }

    const token = this.generateToken({ 
      userId: user.id, 
      role: user.role,
      memberId: user.member?.id,
      librarianId: user.librarian?.id,
    });

    return {
      token,
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        memberId: user.member?.id,
        librarianId: user.librarian?.id,
      },
    };
  }

  verifyToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, this.jwtSecret) as JwtPayload;
    } catch {
      throw AppError.unauthorized('Invalid or expired token');
    }
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  private async comparePassword(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }

  private generateToken(payload: JwtPayload): string {
    return jwt.sign(payload, this.jwtSecret, { expiresIn: this.jwtExpiresIn } as jwt.SignOptions);
  }
}
