import sqlite3
import os

db_path = "/Users/patrickgallowaypro/ErisMorn/input/orchestra-os/dev.db"

if not os.path.exists(db_path):
    print(f"Database file not found at {db_path}")
    exit(1)

try:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Check if tables exist
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()
    print("Tables:", tables)

    # Check Agent count
    try:
        cursor.execute("SELECT count(*) FROM Agent")
        count = cursor.fetchone()[0]
        print(f"Agent count: {count}")

        cursor.execute("SELECT * FROM Agent")
        agents = cursor.fetchall()
        for a in agents:
            print(a)

    except sqlite3.OperationalError as e:
        print(f"Error querying Agent table: {e}")

    conn.close()

except Exception as e:
    print(f"Error connecting to database: {e}")
