-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(50) NOT NULL,
    `username` VARCHAR(50) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT false,
    `token` VARCHAR(255) NULL,
    `role` ENUM('admin', 'kasir', 'resepsionis', 'dapur') NOT NULL DEFAULT 'resepsionis',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ruangan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(50) NOT NULL,
    `kapasitas` INTEGER NOT NULL DEFAULT 0,
    `tarif_per_jam` DECIMAL(10, 2) NOT NULL,
    `status` ENUM('tersedia', 'terisi', 'perawatan') NOT NULL DEFAULT 'tersedia',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ruangan_nama_key`(`nama`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pemesanan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_ruangan` INTEGER NOT NULL,
    `nama` VARCHAR(100) NOT NULL,
    `waktu_mulai` DATETIME(3) NOT NULL,
    `waktu_selesai` DATETIME(3) NULL,
    `durasi_menit` INTEGER NOT NULL,
    `status` ENUM('aktif', 'selesai', 'dibatalkan') NOT NULL DEFAULT 'aktif',

    INDEX `pemesanan_id_ruangan_status_idx`(`id_ruangan`, `status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kategori_menu` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(50) NOT NULL,

    UNIQUE INDEX `kategori_menu_nama_key`(`nama`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `menu_fnb` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(50) NOT NULL,
    `id_kategori` INTEGER NOT NULL,
    `harga` DECIMAL(10, 2) NOT NULL,
    `stok` INTEGER NOT NULL DEFAULT 0,
    `status` ENUM('tersedia', 'habis') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `menu_fnb_id_kategori_status_idx`(`id_kategori`, `status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `detail_pemesanan_fnb` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_pemesanan` INTEGER NOT NULL,
    `id_menu_fnb` INTEGER NOT NULL,
    `jumlah` INTEGER NOT NULL DEFAULT 0,
    `subtotal` DECIMAL(10, 2) NOT NULL,
    `id_user` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `detail_pemesanan_fnb_id_pemesanan_id_menu_fnb_id_user_idx`(`id_pemesanan`, `id_menu_fnb`, `id_user`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transaksi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_pemesanan` INTEGER NOT NULL,
    `id_user` INTEGER NOT NULL,
    `total_sewa` DECIMAL(10, 2) NOT NULL,
    `biaya_tambahan` DECIMAL(10, 2) NOT NULL,
    `total_tagihan` DECIMAL(10, 2) NOT NULL,
    `jumlah_bayar` DECIMAL(10, 2) NOT NULL,
    `kembalian` DECIMAL(10, 2) NOT NULL,
    `metode_pembayaran` ENUM('tunai', 'transfer', 'qris') NOT NULL DEFAULT 'tunai',
    `catatan` TEXT NOT NULL,
    `status` ENUM('lunas', 'belum_lunas') NOT NULL DEFAULT 'belum_lunas',

    INDEX `transaksi_id_user_id_pemesanan_idx`(`id_user`, `id_pemesanan`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `pemesanan` ADD CONSTRAINT `pemesanan_id_ruangan_fkey` FOREIGN KEY (`id_ruangan`) REFERENCES `ruangan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `menu_fnb` ADD CONSTRAINT `menu_fnb_id_kategori_fkey` FOREIGN KEY (`id_kategori`) REFERENCES `kategori_menu`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detail_pemesanan_fnb` ADD CONSTRAINT `detail_pemesanan_fnb_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detail_pemesanan_fnb` ADD CONSTRAINT `detail_pemesanan_fnb_id_pemesanan_fkey` FOREIGN KEY (`id_pemesanan`) REFERENCES `pemesanan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detail_pemesanan_fnb` ADD CONSTRAINT `detail_pemesanan_fnb_id_menu_fnb_fkey` FOREIGN KEY (`id_menu_fnb`) REFERENCES `menu_fnb`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaksi` ADD CONSTRAINT `transaksi_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaksi` ADD CONSTRAINT `transaksi_id_pemesanan_fkey` FOREIGN KEY (`id_pemesanan`) REFERENCES `pemesanan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
