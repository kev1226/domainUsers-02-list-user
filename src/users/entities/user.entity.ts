import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from 'auth-common-nestjs';
import { ApiProperty } from '@nestjs/swagger';

/**
 * User entity representing the structure of the 'users' table.
 */
@Entity()
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false, select: false })
  password: string; // Not exposed in Swagger

  @ApiProperty({ enum: Role, default: Role.USER })
  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @ApiProperty({ type: Date, required: false })
  @DeleteDateColumn()
  deletedAt: Date; //  corrected name from 'deleteAd'
}
