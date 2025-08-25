import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../auth/auth.service';
import { UsuariosController } from '../../controller/usuarios.controller';
import { UsuariosService } from '../../service/usuarios.service';

describe('UsuariosController', () => {
  let controller: UsuariosController;
  let usersService: UsuariosService;
  let jwtService: JwtService;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsuariosController],
      providers: [
        { provide: UsuariosService, useValue: {} },
        { provide: JwtService, useValue: {} },
        { provide: AuthService, useValue: {} },
      ],
    }).compile();

    controller = module.get<UsuariosController>(UsuariosController);
    usersService = module.get<UsuariosService>(UsuariosService);
    jwtService = module.get<JwtService>(JwtService);
    authService = module.get<AuthService>(AuthService);
  });

  it('Usuario controller deve ser definido', () => {
    expect(controller).toBeDefined();
  });

  describe('Create', () => {
    it('Criar um usuário', async () => {
      const createUserDto = {
        nome: 'Teste',
        email: 'teste@example.com',
        usuario: 'teste.exemplo',
        senha: 'teste',
      };
      const result = { id: 1, ...createUserDto };

      // Mockando o método do serviço para retornar um valor específico
      usersService.create = jest.fn().mockResolvedValue(result);

      expect(await controller.create(createUserDto)).toEqual(result);
    });
  });
});
