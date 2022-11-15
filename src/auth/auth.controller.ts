import { Body, Controller, Delete, Get, Headers, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IncomingHttpHeaders } from 'http';

import { AuthService } from './auth.service';
import { Auth, GetUser, RawHeaders } from './decorators/';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from './dto';
import { User } from './entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.loginUser(loginUserDto);
  }

  // Si el token aun esta activo podemos traer todos los datos de la BD y Renovamos el TOKEN
  @Get('check-status')
  @Auth() //Con solo esto aseguramos que el token es valido y puede entrar aca
  checkStatus(@GetUser() user: User) {
    return this.authService.checkStatus(user);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    @GetUser() user: User,
    @GetUser('email') userEmail: string,
    @RawHeaders() rawHeaders: string[],
    @Headers() headers: IncomingHttpHeaders,
  ) {
    return {
      ok: true,
      msg: 'Hola Mao',
      user,
      userEmail,
      rawHeaders,
      headers,
    };
  }

  @Get('private2')
  @UseGuards(AuthGuard())
  privateRoute2(@GetUser() user: User) {
    return {
      ok: true,
      msg: 'Hola Mao Priv2',
      user,
    };
  }

  @Get('private3')
  // @Auth(ValidRoles.admin)
  // @Auth(ValidRoles.admin, ValidRoles.superUser)
  @Auth()
  privateRoute3(@GetUser() user: User) {
    return {
      ok: true,
      msg: 'Hola Mao Priv3',
      user,
    };
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.authService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
