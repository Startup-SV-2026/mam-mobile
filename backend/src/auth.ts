import crypto from "node:crypto";
import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import fs from "node:fs";
import type { Progress } from "../../shared/types/course";

export interface UserAccount {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: string;
  progress: Partial<Progress> & {
    saved?: string[];
    notes?: Record<string, string>;
    illustrationIds?: Record<string, string>;
    selectedCourseId?: string;
  };
}

export interface SessionToken {
  token: string;
  userId: string;
  expiresAt: number;
}

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(`mam_salt_${password}`).digest("hex");
}

// Demo account with pre-seeded learning progress, notes, and saved cards
const DEMO_USER: UserAccount = {
  id: "user_demo_01",
  email: "demo@mam.edu.vn",
  name: "Nguyễn An",
  passwordHash: hashPassword("mam123456"),
  createdAt: "2026-11-01T08:00:00.000Z",
  progress: {
    selectedCourseId: "tran",
    completed: {
      "tran:0": true,
      "tran:1": true,
      "space:0": true,
    },
    xp: 75,
    streak: 4,
    lastStudy: new Date().toISOString().slice(0, 10),
    saved: ["tran:0:0", "tran:1:0", "space:0:1"],
    notes: {
      "tran:0": "Hội nghị Diên Hồng năm 1284: 'Nên đánh hay nên hòa?' - Muôn người cùng hô ĐÁNH!",
      "tran": "Khóa học nhà Trần rất hay, chiến thuật vườn không nhà trống và tinh thần đoàn kết toàn dân.",
      "space:0": "Hệ Mặt Trời có 8 hành tinh chính, Trái Đất ở vùng Goldilocks cho phép nước tồn tại dạng lỏng.",
    },
    reviews: {
      "tran:0": { interval: 3, repetitions: 2, due: Date.now() + 86400000 },
      "tran:1": { interval: 1, repetitions: 1, due: Date.now() },
    },
    illustrationIds: {
      "tran:0": "tran-lesson1",
      "tran:1": "tran-lesson2",
    },
    customCourses: [],
  },
};

export class AuthStore {
  private db: DatabaseSync;

  constructor(dbPath?: string) {
    const resolvedPath = dbPath ?? path.resolve(process.cwd(), "backend/data/mam.db");
    if (resolvedPath !== ":memory:") {
      const dir = path.dirname(resolvedPath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    }
    this.db = new DatabaseSync(resolvedPath);

    this.initSchema();
    this.seedDemoUser();
  }

  private initSchema() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TEXT NOT NULL,
        progress_json TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS sessions (
        token TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        expires_at INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
    `);
  }

  private seedDemoUser() {
    const existing = this.db
      .prepare("SELECT id FROM users WHERE email = ?")
      .get(DEMO_USER.email.toLowerCase());

    if (!existing) {
      this.db
        .prepare(`
          INSERT INTO users (id, email, name, password_hash, created_at, progress_json)
          VALUES (?, ?, ?, ?, ?, ?)
        `)
        .run(
          DEMO_USER.id,
          DEMO_USER.email.toLowerCase(),
          DEMO_USER.name,
          DEMO_USER.passwordHash,
          DEMO_USER.createdAt,
          JSON.stringify(DEMO_USER.progress),
        );
    } else {
      // Keep demo display name in sync with code for existing databases
      this.db
        .prepare("UPDATE users SET name = ? WHERE email = ?")
        .run(DEMO_USER.name, DEMO_USER.email.toLowerCase());
    }
  }

  register(
    email: string,
    password: string,
    name: string,
  ): { user: Omit<UserAccount, "passwordHash">; token: string } {
    const normalizedEmail = email.trim().toLowerCase();
    const existing = this.db
      .prepare("SELECT id FROM users WHERE email = ?")
      .get(normalizedEmail);

    if (existing) {
      throw new Error("Email này đã được đăng ký tài khoản.");
    }

    const newUser: UserAccount = {
      id: `user_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      email: normalizedEmail,
      name: name.trim() || "Người học Mầm",
      passwordHash: hashPassword(password),
      createdAt: new Date().toISOString(),
      progress: {
        completed: {},
        xp: 0,
        streak: 0,
        lastStudy: "",
        saved: [],
        notes: {},
        reviews: {},
        illustrationIds: {},
        customCourses: [],
        selectedCourseId: "space",
      },
    };

    this.db
      .prepare(`
        INSERT INTO users (id, email, name, password_hash, created_at, progress_json)
        VALUES (?, ?, ?, ?, ?, ?)
      `)
      .run(
        newUser.id,
        newUser.email,
        newUser.name,
        newUser.passwordHash,
        newUser.createdAt,
        JSON.stringify(newUser.progress),
      );

    const token = this.createSession(newUser.id);
    const { passwordHash: _, ...safeUser } = newUser;
    return { user: safeUser, token };
  }

  login(
    email: string,
    password: string,
  ): { user: Omit<UserAccount, "passwordHash">; token: string } {
    const normalizedEmail = email.trim().toLowerCase();
    const row = this.db
      .prepare("SELECT * FROM users WHERE email = ?")
      .get(normalizedEmail) as any;

    if (!row || row.password_hash !== hashPassword(password)) {
      throw new Error("Email hoặc mật khẩu không chính xác.");
    }

    const token = this.createSession(row.id);
    let progress = {};
    try {
      progress = JSON.parse(row.progress_json);
    } catch {}

    const safeUser: Omit<UserAccount, "passwordHash"> = {
      id: row.id,
      email: row.email,
      name: row.name,
      createdAt: row.created_at,
      progress,
    };

    return { user: safeUser, token };
  }

  getDemoAccount(): { user: Omit<UserAccount, "passwordHash">; token: string } {
    return this.login("demo@mam.edu.vn", "mam123456");
  }

  getUserByToken(token: string): Omit<UserAccount, "passwordHash"> | null {
    const session = this.db
      .prepare("SELECT * FROM sessions WHERE token = ?")
      .get(token) as any;

    if (!session) return null;
    if (Date.now() > session.expires_at) {
      this.db.prepare("DELETE FROM sessions WHERE token = ?").run(token);
      return null;
    }

    const userRow = this.db
      .prepare("SELECT * FROM users WHERE id = ?")
      .get(session.user_id) as any;

    if (!userRow) return null;

    let progress = {};
    try {
      progress = JSON.parse(userRow.progress_json);
    } catch {}

    return {
      id: userRow.id,
      email: userRow.email,
      name: userRow.name,
      createdAt: userRow.created_at,
      progress,
    };
  }

  syncProgress(
    token: string,
    progress: UserAccount["progress"],
  ): Omit<UserAccount, "passwordHash"> {
    const user = this.getUserByToken(token);
    if (!user) throw new Error("Phiên đăng nhập hết hạn.");

    const mergedProgress = { ...user.progress, ...progress };
    this.db
      .prepare("UPDATE users SET progress_json = ? WHERE id = ?")
      .run(JSON.stringify(mergedProgress), user.id);

    return { ...user, progress: mergedProgress };
  }

  logout(token: string) {
    this.db.prepare("DELETE FROM sessions WHERE token = ?").run(token);
  }

  private createSession(userId: string): string {
    const token = `mam_token_${crypto.randomBytes(24).toString("hex")}`;
    const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days
    this.db
      .prepare("INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)")
      .run(token, userId, expiresAt);
    return token;
  }
}
