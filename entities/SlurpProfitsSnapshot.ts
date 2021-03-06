import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class SlurpProfitsSnapshot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  contractAddress: string;

  @Column({ nullable: true })
  vaultContractAddress: string;

  @CreateDateColumn()
  timestamp: Date;

  @Column({ type: 'float' })
  collateralPerMarginOutstanding: number;

  @Column({ type: 'float' })
  debtPerMarginOutstanding: number;

  @Column({ type: 'float' })
  leverageRatio: number;

  @Column({ type: 'float' })
  nav: number;

  @Column({ type: 'float', nullable: true })
  totalSupply: number;

  @Column({ type: 'float', nullable: true })
  maxTotalCollateral: number;

  @Column({ type: 'float', nullable: true })
  totalCollateralPlusFee: number;

  @Column({ type: 'float', nullable: true })
  totalPendingFees: number;

  @Column({ type: 'float', nullable: true })
  outstandingDebt: number;

  @Column({ type: 'float', nullable: true })
  collateralPrice: number;

  @Column({ type: 'int', nullable: true })
  blockNumber: number;
}
