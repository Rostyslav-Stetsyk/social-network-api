import { UserEntity } from 'src/auth/users/entity/user.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class SessionEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => UserEntity, (user) => user.id)
  user!: string;

  @Column()
  accessToken!: string;

  @Column()
  refreshToken!: string;

  @Column()
  ip?: string;

  @Column()
  userAgent?: string;

  @DeleteDateColumn()
  deletedAt?: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
