import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from "typeorm";
import { User } from "./User";

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.messages, { nullable: false })
  user: User;

  @ManyToOne(() => Message, (message) => message.children)
  parent: Message;

  @OneToMany(() => Message, (message) => message.parent)
  children: Message[];
}
