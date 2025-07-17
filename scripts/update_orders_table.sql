-- Add payment_reference column to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_reference VARCHAR(255);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_payment_reference ON orders(payment_reference);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
