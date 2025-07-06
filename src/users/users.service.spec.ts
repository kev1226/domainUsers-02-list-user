import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  const mockUsers: User[] = [
    {
      id: 1,
      name: 'Alice',
      email: 'alice@test.com',
      password: 'hashed',
    } as User,
    { id: 2, name: 'Bob', email: 'bob@test.com', password: 'hashed' } as User,
  ];

  const mockUserRepository = {
    find: jest.fn().mockResolvedValue(mockUsers),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all users', async () => {
    const result = await service.findAll();
    expect(result).toEqual(mockUsers);
    expect(repository.find).toHaveBeenCalledTimes(1);
  });
});
