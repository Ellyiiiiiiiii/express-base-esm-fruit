-- 單選(查詢字串 QS: brand=Apple)
SELECT * FROM my_product
WHERE brand = 'google';

-- 複選(查詢字串 QS: brands=Apple,Google)
SELECT * FROM my_product
WHERE brand = 'google' OR brand = 'apple';

-- IN
SELECT * FROM my_product
WHERE brand IN ('google', 'apple');

-- keyword(查詢字串 QS: name_like=sa)
SELECT * FROM my_product
WHERE name LIKE '%sa%';

-- 價格區間>=5000, <=15000查詢(查詢字串 QS: price_gte=5000&price_lte=15000)
-- SELECT * FROM my_product
-- WHERE price BETWEEN 5000 AND 15000;

SELECT * FROM my_product
WHERE price >= 5000 AND price <= 15000;

-- 整合測試
SELECT * FROM my_product
WHERE brand IN ('google', 'apple')
AND name LIKE '%o%'
AND price >= 5000 AND price <= 15000;

-- 排序(查詢字串 QS: sort=price&order=asc)(順向asc, 逆向desc)
SELECT * FROM my_product
WHERE brand IN ('google', 'apple')
ORDER BY price DESC;

-- 分頁(查詢字串 QS: page=2&perpage=5) (目前page頁，每頁perpage筆資料)
-- 公式: limit = perpage
--       offset = (page-1) * perpage
SELECT * FROM my_product
WHERE brand IN ('google', 'apple')
ORDER BY price DESC
LIMIT 5 OFFSET 5;

-- 另外需計算在此條件下共幾筆(WHERE)
SELECT COUNT(*) AS count
FROM my_product
WHERE brand IN ('google', 'apple');