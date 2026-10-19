-- Mock data for TB_Stock and TB_Product (SQL Server)
-- Database: StockShopping
-- Inserts only when both tables are empty, so it is safe to run more than once.

USE [StockShopping];
GO

SET NOCOUNT ON;

IF EXISTS (SELECT 1 FROM dbo.TB_Stock) OR EXISTS (SELECT 1 FROM dbo.TB_Product)
BEGIN
    PRINT 'TB_Stock or TB_Product already has data - skipping seed.';
    RETURN;
END

BEGIN TRANSACTION;

-- ===== TB_Stock =====
SET IDENTITY_INSERT dbo.TB_Stock ON;

INSERT INTO dbo.TB_Stock (Id, Quantity, LastUpdated) VALUES
    (1,  50,  SYSDATETIME()),
    (2,  120, SYSDATETIME()),
    (3,  35,  SYSDATETIME()),
    (4,  0,   SYSDATETIME()),   -- out of stock
    (5,  80,  SYSDATETIME()),
    (6,  15,  SYSDATETIME()),
    (7,  200, SYSDATETIME()),
    (8,  60,  SYSDATETIME()),
    (9,  5,   SYSDATETIME()),   -- low stock
    (10, 90,  SYSDATETIME()),
    (11, 40,  SYSDATETIME()),
    (12, 25,  SYSDATETIME());

SET IDENTITY_INSERT dbo.TB_Stock OFF;

-- ===== TB_Product =====
SET IDENTITY_INSERT dbo.TB_Product ON;

INSERT INTO dbo.TB_Product (Id, StockId, Name, Description, ImageUrl, Price) VALUES
    (1,  1,  N'Wireless Mouse',          N'เมาส์ไร้สาย 2.4GHz แบตเตอรี่ใช้งานได้นาน 12 เดือน',            N'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop',  590.00),
    (2,  2,  N'USB-C Cable 1m',          N'สายชาร์จ USB-C รองรับชาร์จเร็ว 60W ความยาว 1 เมตร',           N'https://images.unsplash.com/photo-1595756630452-736bc8ef3693?w=400&h=400&fit=crop',  199.00),
    (3,  3,  N'Mechanical Keyboard',     N'คีย์บอร์ด Mechanical Blue Switch มีไฟ RGB',                    N'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&h=400&fit=crop',  2490.00),
    (4,  4,  N'27" Monitor',             N'จอมอนิเตอร์ 27 นิ้ว IPS 2K 75Hz',                              N'https://images.unsplash.com/photo-1547658718-1cdaa0852790?w=400&h=400&fit=crop',  7990.00),
    (5,  5,  N'Laptop Stand',            N'แท่นวางโน้ตบุ๊กอะลูมิเนียม ปรับระดับได้ 6 ระดับ',               N'https://images.unsplash.com/photo-1629317480826-910f729d1709?w=400&h=400&fit=crop',  890.00),
    (6,  6,  N'Noise Cancelling Headphones', N'หูฟังครอบหูตัดเสียงรบกวน ANC เชื่อมต่อ Bluetooth 5.3',      N'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',  4590.00),
    (7,  7,  N'Mouse Pad XL',            N'แผ่นรองเมาส์ขนาดใหญ่ 80x30 ซม. กันลื่น',                       N'https://images.unsplash.com/photo-1650394923482-a0d03ffb2512?w=400&h=400&fit=crop',  290.00),
    (8,  8,  N'Webcam Full HD',          N'กล้องเว็บแคม 1080p พร้อมไมโครโฟนในตัว',                         N'https://images.unsplash.com/photo-1760348213920-d2a90ed705fd?w=400&h=400&fit=crop',  1290.00),
    (9,  9,  N'Portable SSD 1TB',        N'SSD พกพา 1TB ความเร็วอ่าน 1050MB/s',                           N'https://images.unsplash.com/photo-1779896412305-638de9b07d8a?w=400&h=400&fit=crop',  3290.00),
    (10, 10, N'Power Bank 20000mAh',     N'แบตสำรอง 20000mAh รองรับ PD 20W',                               N'https://images.unsplash.com/photo-1566554738544-d962991c3fee?w=400&h=400&fit=crop', 790.00),
    (11, 11, N'Bluetooth Speaker',       N'ลำโพงบลูทูธกันน้ำ IPX7 เล่นต่อเนื่อง 10 ชั่วโมง',                N'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop', 1490.00),
    (12, 12, N'USB Hub 7-in-1',          N'อะแดปเตอร์ USB-C 7 in 1 มี HDMI 4K, USB 3.0, SD/microSD',       N'https://images.unsplash.com/photo-1760376789487-994070337c76?w=400&h=400&fit=crop', 1190.00);

SET IDENTITY_INSERT dbo.TB_Product OFF;

COMMIT TRANSACTION;

PRINT 'Seeded 12 stocks and 12 products.';
GO

-- Check result
SELECT p.Id, p.Name, p.Price, s.Quantity, s.LastUpdated
FROM dbo.TB_Product p
JOIN dbo.TB_Stock s ON s.Id = p.StockId
ORDER BY p.Id;
