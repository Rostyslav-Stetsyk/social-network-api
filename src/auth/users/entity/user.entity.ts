import { SessionEntity } from 'src/auth/sessions/entity/session.entity';
import { PostEntity } from 'src/posts/entity/post.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  telephone!: string;

  @Column({
    unique: true,
  })
  email!: string;

  @Column({
    unique: true,
  })
  username!: string;

  @Column()
  password!: string;

  @OneToMany(() => PostEntity, (post) => post.author)
  posts?: PostEntity[];

  @OneToMany(() => SessionEntity, (session) => session.user)
  sessions?: SessionEntity[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
