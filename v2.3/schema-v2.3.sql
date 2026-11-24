-- =========================================================
-- GOLD MASTER AI V2.3
-- D1 DATABASE SCHEMA
-- TEST VERSION ONLY
-- DO NOT RUN ON PRODUCTION DATABASE
-- =========================================================

PRAGMA foreign_keys = ON;

-- 1. Request ID: ป้องกันการรับคำขอซ้ำ
CREATE TABLE IF NOT EXISTS v23_request_ids (
    request_id TEXT PRIMARY KEY,
    route TEXT NOT NULL,
    received_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. EA Heartbeat
CREATE TABLE IF NOT EXISTS v23_heartbeats (
    account_id TEXT PRIMARY KEY,
    ea_running INTEGER NOT NULL CHECK(ea_running IN (0,1)),
    terminal_connected INTEGER NOT NULL CHECK(terminal_connected IN (0,1)),
    last_error TEXT,
    event_time INTEGER NOT NULL,
    received_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. Market Ticks
CREATE TABLE IF NOT EXISTS v23_ticks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    account_id TEXT NOT NULL,
    symbol TEXT NOT NULL,
    event_time INTEGER NOT NULL,
    bid REAL NOT NULL CHECK(bid > 0),
    ask REAL NOT NULL CHECK(ask >= bid),
    spread REAL NOT NULL CHECK(spread >= 0),
    tick_size REAL NOT NULL CHECK(tick_size > 0),
    tick_value REAL NOT NULL CHECK(tick_value > 0),
    received_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_v23_ticks_time
ON v23_ticks(account_id, event_time DESC);

-- 4. Account Snapshots
CREATE TABLE IF NOT EXISTS v23_account_snapshots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    account_id TEXT NOT NULL,
    currency TEXT NOT NULL,
    balance REAL NOT NULL CHECK(balance >= 0),
    equity REAL NOT NULL CHECK(equity >= 0),
    margin REAL NOT NULL CHECK(margin >= 0),
    free_margin REAL NOT NULL CHECK(free_margin >= 0),
    event_time INTEGER NOT NULL,
    received_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_v23_account_time
ON v23_account_snapshots(account_id, event_time DESC);

-- 5. Open Positions
CREATE TABLE IF NOT EXISTS v23_positions (
    account_id TEXT NOT NULL,
    ticket TEXT NOT NULL,
    symbol TEXT NOT NULL,
    position_type TEXT NOT NULL
        CHECK(position_type IN ('BUY','SELL')),
    volume REAL NOT NULL CHECK(volume > 0),
    entry_price REAL NOT NULL CHECK(entry_price > 0),
    stop_loss REAL,
    take_profit REAL,
    event_time INTEGER NOT NULL,
    received_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(account_id, ticket)
);

-- 6. Closed Deals
CREATE TABLE IF NOT EXISTS v23_closed_deals (
    account_id TEXT NOT NULL,
    deal_ticket TEXT NOT NULL,
    symbol TEXT NOT NULL,
    deal_type TEXT NOT NULL
        CHECK(deal_type IN ('BUY','SELL')),
    volume REAL NOT NULL CHECK(volume > 0),
    profit REAL NOT NULL,
    commission REAL NOT NULL,
    swap REAL NOT NULL,
    net_profit REAL NOT NULL,
    close_time INTEGER NOT NULL,
    received_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(account_id, deal_ticket)
);

CREATE INDEX IF NOT EXISTS idx_v23_deals_time
ON v23_closed_deals(account_id, close_time);

-- 7. Profit Cycles
CREATE TABLE IF NOT EXISTS v23_profit_cycles (
    cycle_id INTEGER PRIMARY KEY AUTOINCREMENT,
    account_id TEXT NOT NULL,
    baseline_balance REAL NOT NULL,
    realized_net_profit REAL NOT NULL DEFAULT 0,
    target_profit REAL NOT NULL DEFAULT 150,
    target_currency TEXT NOT NULL DEFAULT 'USD',
    status TEXT NOT NULL DEFAULT 'ACTIVE'
        CHECK(status IN ('ACTIVE','LOCKED','CLOSED')),
    withdrawal_confirmed INTEGER NOT NULL DEFAULT 0
        CHECK(withdrawal_confirmed IN (0,1)),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    locked_at TEXT,
    unlocked_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_v23_cycle_status
ON v23_profit_cycles(account_id, status, cycle_id DESC);

-- ป้องกันไม่ให้มีรอบ ACTIVE/LOCKED ซ้อนกันในบัญชีเดียว
CREATE UNIQUE INDEX IF NOT EXISTS idx_v23_one_open_cycle
ON v23_profit_cycles(account_id)
WHERE status IN ('ACTIVE','LOCKED');

-- 8. Trigger: นับกำไรสุทธิจาก Closed Deals
-- นับเฉพาะรายการที่เพิ่มเข้าครั้งแรก
-- เมื่อถึงเป้าหมาย 150 USD ให้ล็อกการเปิดออเดอร์ใหม่
-- ยังคงนับผลกำไร/ขาดทุนจาก Position เดิมที่ปิดภายหลัง

CREATE TRIGGER IF NOT EXISTS trg_v23_count_deal
AFTER INSERT ON v23_closed_deals
BEGIN
    UPDATE v23_profit_cycles
    SET
        realized_net_profit =
            realized_net_profit + NEW.net_profit,

        status = CASE
            WHEN status = 'LOCKED' THEN 'LOCKED'
            WHEN realized_net_profit + NEW.net_profit >= target_profit
                THEN 'LOCKED'
            ELSE status
        END,

        locked_at = CASE
            WHEN status = 'ACTIVE'
             AND realized_net_profit + NEW.net_profit >= target_profit
             AND locked_at IS NULL
                THEN CURRENT_TIMESTAMP
            ELSE locked_at
        END

    WHERE account_id = NEW.account_id
      AND status IN ('ACTIVE','LOCKED')
      AND cycle_id = (
          SELECT MAX(cycle_id)
          FROM v23_profit_cycles
          WHERE account_id = NEW.account_id
            AND status IN ('ACTIVE','LOCKED')
      );
END;

-- 9. System Events / Audit Log
CREATE TABLE IF NOT EXISTS v23_system_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_type TEXT NOT NULL,
    severity TEXT NOT NULL
        CHECK(severity IN ('INFO','WARN','ERROR','CRITICAL')),
    message TEXT NOT NULL,
    source TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_v23_events_time
ON v23_system_events(created_at DESC);

-- =========================================================
-- END OF V2.3 SCHEMA
-- =========================================================
