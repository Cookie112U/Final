from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# Настройка CORS для работы с фронтендом
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost",
        "http://localhost:80",
        "http://frontend",
        "http://frontend:80"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
class TankRequest(BaseModel):
    n: int
    volumes: list[int]

@app.post("/calculate")
def calculate_operations(data: TankRequest):
    """
    Рассчитывает минимальное количество операций для выравнивания резервуаров
    """
    volumes = data.volumes
    n = data.n
    
    # Проверка данных
    if len(volumes) != n:
        raise HTTPException(status_code=400, detail="Количество объемов не соответствует n")
    
    if n < 1 or n > 100000:
        raise HTTPException(status_code=400, detail="n должно быть между 1 и 100000")
    
    if any(v < 1 or v > 10**9 for v in volumes):
        raise HTTPException(status_code=400, detail="Объемы должны быть между 1 и 10^9")
    
    # Основная логика алгоритма
    for i in range(n-1):
        if volumes[i] > volumes[i+1]:
            return {"result": -1, "message": "Выравнивание невозможно"}
    
    operations = volumes[-1] - volumes[0]
    return {"result": operations, "message": "Успешно"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)