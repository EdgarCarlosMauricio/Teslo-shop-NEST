import { IsString } from 'class-validator';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Product } from '../../products/entities';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  @IsString()
  id: string;

  @IsString()
  @Column('text', {
    unique: true,
  })
  email: string;

  @IsString()
  @Column('text', { select: false })
  password: string;

  @IsString()
  @Column('text', { select: false })
  passwordmd5: string;

  @IsString()
  @Column('text')
  fullName: string;

  @IsString()
  @Column('bool', { default: true })
  isActive: boolean;

  @Column('text', {
    array: true,
    default: ['user'],
  })
  roles: string[];

  // Relacion Con Productos
  @OneToMany(() => Product, (product) => product.user)
  product: Product;

  @BeforeInsert()
  checkFieldBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
    this.fullName = this.fullName.toUpperCase().trim();
  }

  @BeforeUpdate()
  checkFieldBeforeUpdate() {
    this.checkFieldBeforeInsert();
  }
}
