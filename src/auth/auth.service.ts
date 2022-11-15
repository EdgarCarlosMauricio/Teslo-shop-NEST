import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import * as md5 from 'md5';
import { Repository } from 'typeorm';

import { CreateUserDto, LoginUserDto, UpdateUserDto } from './dto';
import { User } from './entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    // private readonly logger = new Logger('AuthService'),
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    try {
      const { password, ...rest } = createUserDto;
      const user = this.userRepository.create({
        ...rest,
        password: bcrypt.hashSync(password, 10),
        passwordmd5: md5(password),
      });
      if (!user) throw new BadRequestException('error');
      await this.userRepository.save(user);
      // Eliminar Data que el usuario no debe visualizar
      this.deleteDataViewUser(user);
      // retornar JWT
      return {
        ...user,
        token: this.getJwtToken({ id: user.id }),
      };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async loginUser(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;
    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, passwordmd5: true, id: true },
    });
    if (!user)
      throw new UnauthorizedException('Credentials are not valid (email)');
    if (md5(password) != user.passwordmd5)
      throw new UnauthorizedException(
        'Credentials are not valid (passwordmd5)',
      );
    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credentials are not valid (password)');
    // Eliminar Data que el usuario no debe visualizar
    this.deleteDataViewUser(user);

    // retornar JWT
    return {
      ...user,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  private deleteDataViewUser(user: User) {
    delete user.password;
    delete user.passwordmd5;
    delete user.id;
    delete user.isActive;
    return user;
  }

  async checkStatus(user: User) {
    // retornar JWT
    return {
      ...user,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateUserDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  private handleDBExceptions(error: any): never {
    if (error.code === '23505') {
      // this.logger.error(error.detail);
      throw new BadRequestException(error.detail);
    }
    // this.logger.error(error);
    console.log(error);
    throw new InternalServerErrorException(
      'UnExpected error, check server logs',
    );
  }
}
