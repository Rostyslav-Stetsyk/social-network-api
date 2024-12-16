import { UserEntity } from 'src/users/entity/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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
}
