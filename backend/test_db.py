import oracledb

conn = oracledb.connect(
    user="careconnect",
    password="CareConnect_123",
    dsn="localhost:1521/FREEPDB1",
)
print("Connected! Oracle version:", conn.version)
conn.close()