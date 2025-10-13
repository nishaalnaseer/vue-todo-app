from datetime import datetime
from typing import Annotated, TypeVar, Generic, List

from fastapi import FastAPI, HTTPException, Path
from starlette.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Todo(BaseModel):
    id: int = 0
    todo: str
    date: datetime
    done: bool


class User(BaseModel):
    id: int = 0
    staff_id: str
    name: str
    created: datetime = datetime.now()
    joined: datetime
    enabled: bool
    email: str


T = TypeVar("T", bound=BaseModel)


class Page(BaseModel, Generic[T]):
    total_rows: int
    current_page: int
    rows_per_page: int
    page: List[T]


users = [
    User(id=1, staff_id="STF001", name="Alice Johnson", created=datetime(2023, 1, 15, 9, 0),
         joined=datetime(2023, 2, 1, 9, 0), enabled=True, email="alice.johnson@company.com"),
    User(id=2, staff_id="STF002", name="Bob Smith", created=datetime(2023, 1, 20, 10, 30),
         joined=datetime(2023, 2, 5, 10, 30), enabled=True, email="bob.smith@company.com"),
    User(id=3, staff_id="STF003", name="Carol White", created=datetime(2023, 2, 10, 11, 15),
         joined=datetime(2023, 3, 1, 11, 15), enabled=True, email="carol.white@company.com"),
    User(id=4, staff_id="STF004", name="David Brown", created=datetime(2023, 2, 15, 14, 0),
         joined=datetime(2023, 3, 5, 14, 0), enabled=False, email="david.brown@company.com"),
    User(id=5, staff_id="STF005", name="Emma Davis", created=datetime(2023, 3, 1, 8, 30),
         joined=datetime(2023, 3, 15, 8, 30), enabled=True, email="emma.davis@company.com"),
    User(id=6, staff_id="STF006", name="Frank Miller", created=datetime(2023, 3, 10, 13, 45),
         joined=datetime(2023, 4, 1, 13, 45), enabled=True, email="frank.miller@company.com"),
    User(id=7, staff_id="STF007", name="Grace Wilson", created=datetime(2023, 3, 20, 9, 20),
         joined=datetime(2023, 4, 10, 9, 20), enabled=True, email="grace.wilson@company.com"),
    User(id=8, staff_id="STF008", name="Henry Moore", created=datetime(2023, 4, 5, 10, 0),
         joined=datetime(2023, 4, 20, 10, 0), enabled=True, email="henry.moore@company.com"),
    User(id=9, staff_id="STF009", name="Isla Taylor", created=datetime(2023, 4, 15, 11, 30),
         joined=datetime(2023, 5, 1, 11, 30), enabled=False, email="isla.taylor@company.com"),
    User(id=10, staff_id="STF010", name="Jack Anderson", created=datetime(2023, 5, 1, 15, 0),
         joined=datetime(2023, 5, 15, 15, 0), enabled=True, email="jack.anderson@company.com"),
    User(id=11, staff_id="STF011", name="Kate Thomas", created=datetime(2023, 5, 10, 9, 45),
         joined=datetime(2023, 6, 1, 9, 45), enabled=True, email="kate.thomas@company.com"),
    User(id=12, staff_id="STF012", name="Liam Jackson", created=datetime(2023, 5, 20, 12, 0),
         joined=datetime(2023, 6, 5, 12, 0), enabled=True, email="liam.jackson@company.com"),
    User(id=13, staff_id="STF013", name="Mia Martin", created=datetime(2023, 6, 1, 8, 15),
         joined=datetime(2023, 6, 15, 8, 15), enabled=True, email="mia.martin@company.com"),
    User(id=14, staff_id="STF014", name="Noah Lee", created=datetime(2023, 6, 10, 14, 30),
         joined=datetime(2023, 7, 1, 14, 30), enabled=False, email="noah.lee@company.com"),
    User(id=15, staff_id="STF015", name="Olivia Harris", created=datetime(2023, 6, 20, 10, 45),
         joined=datetime(2023, 7, 10, 10, 45), enabled=True, email="olivia.harris@company.com"),
    User(id=16, staff_id="STF016", name="Paul Clark", created=datetime(2023, 7, 1, 9, 0),
         joined=datetime(2023, 7, 20, 9, 0), enabled=True, email="paul.clark@company.com"),
    User(id=17, staff_id="STF017", name="Quinn Lewis", created=datetime(2023, 7, 15, 13, 0),
         joined=datetime(2023, 8, 1, 13, 0), enabled=True, email="quinn.lewis@company.com"),
    User(id=18, staff_id="STF018", name="Rachel Walker", created=datetime(2023, 8, 1, 11, 30),
         joined=datetime(2023, 8, 15, 11, 30), enabled=True, email="rachel.walker@company.com"),
    User(id=19, staff_id="STF019", name="Sam Hall", created=datetime(2023, 8, 10, 15, 15),
         joined=datetime(2023, 9, 1, 15, 15), enabled=False, email="sam.hall@company.com"),
    User(id=20, staff_id="STF020", name="Tina Allen", created=datetime(2023, 8, 25, 9, 30),
         joined=datetime(2023, 9, 10, 9, 30), enabled=True, email="tina.allen@company.com"),
    User(id=21, staff_id="STF021", name="Uma Young", created=datetime(2023, 9, 5, 12, 45),
         joined=datetime(2023, 9, 20, 12, 45), enabled=True, email="uma.young@company.com"),
    User(id=22, staff_id="STF022", name="Victor King", created=datetime(2023, 9, 15, 8, 0),
         joined=datetime(2023, 10, 1, 8, 0), enabled=True, email="victor.king@company.com"),
    User(id=23, staff_id="STF023", name="Wendy Wright", created=datetime(2023, 10, 1, 14, 0),
         joined=datetime(2023, 10, 15, 14, 0), enabled=True, email="wendy.wright@company.com"),
    User(id=24, staff_id="STF024", name="Xavier Scott", created=datetime(2023, 10, 10, 10, 30),
         joined=datetime(2023, 11, 1, 10, 30), enabled=False, email="xavier.scott@company.com"),
    User(id=25, staff_id="STF025", name="Yara Green", created=datetime(2023, 10, 20, 13, 15),
         joined=datetime(2023, 11, 5, 13, 15), enabled=True, email="yara.green@company.com"),
    User(id=26, staff_id="STF026", name="Zack Adams", created=datetime(2023, 11, 1, 9, 0),
         joined=datetime(2023, 11, 15, 9, 0), enabled=True, email="zack.adams@company.com"),
    User(id=27, staff_id="STF027", name="Amy Baker", created=datetime(2023, 11, 10, 11, 45),
         joined=datetime(2023, 12, 1, 11, 45), enabled=True, email="amy.baker@company.com"),
    User(id=28, staff_id="STF028", name="Ben Nelson", created=datetime(2023, 11, 20, 15, 30),
         joined=datetime(2023, 12, 10, 15, 30), enabled=True, email="ben.nelson@company.com"),
    User(id=29, staff_id="STF029", name="Chloe Carter", created=datetime(2023, 12, 1, 8, 45),
         joined=datetime(2023, 12, 20, 8, 45), enabled=False, email="chloe.carter@company.com"),
    User(id=30, staff_id="STF030", name="Dylan Mitchell", created=datetime(2023, 12, 10, 12, 0),
         joined=datetime(2024, 1, 5, 12, 0), enabled=True, email="dylan.mitchell@company.com"),
    User(id=31, staff_id="STF031", name="Eva Perez", created=datetime(2024, 1, 5, 9, 15),
         joined=datetime(2024, 1, 20, 9, 15), enabled=True, email="eva.perez@company.com"),
    User(id=32, staff_id="STF032", name="Finn Roberts", created=datetime(2024, 1, 15, 14, 45),
         joined=datetime(2024, 2, 1, 14, 45), enabled=True, email="finn.roberts@company.com"),
    User(id=33, staff_id="STF033", name="Gina Turner", created=datetime(2024, 2, 1, 10, 0),
         joined=datetime(2024, 2, 15, 10, 0), enabled=True, email="gina.turner@company.com"),
    User(id=34, staff_id="STF034", name="Hugo Phillips", created=datetime(2024, 2, 10, 13, 30),
         joined=datetime(2024, 3, 1, 13, 30), enabled=False, email="hugo.phillips@company.com"),
    User(id=35, staff_id="STF035", name="Ivy Campbell", created=datetime(2024, 2, 20, 11, 0),
         joined=datetime(2024, 3, 10, 11, 0), enabled=True, email="ivy.campbell@company.com"),
    User(id=36, staff_id="STF036", name="Jake Parker", created=datetime(2024, 3, 1, 8, 30),
         joined=datetime(2024, 3, 20, 8, 30), enabled=True, email="jake.parker@company.com"),
    User(id=37, staff_id="STF037", name="Kara Evans", created=datetime(2024, 3, 15, 15, 0),
         joined=datetime(2024, 4, 1, 15, 0), enabled=True, email="kara.evans@company.com"),
    User(id=38, staff_id="STF038", name="Leo Edwards", created=datetime(2024, 4, 1, 9, 45),
         joined=datetime(2024, 4, 20, 9, 45), enabled=True, email="leo.edwards@company.com"),
    User(id=39, staff_id="STF039", name="Maya Collins", created=datetime(2024, 4, 10, 12, 30),
         joined=datetime(2024, 5, 1, 12, 30), enabled=False, email="maya.collins@company.com"),
    User(id=40, staff_id="STF040", name="Nate Stewart", created=datetime(2024, 4, 25, 14, 15),
         joined=datetime(2024, 5, 15, 14, 15), enabled=True, email="nate.stewart@company.com"),
    User(id=41, staff_id="STF041", name="Opal Sanchez", created=datetime(2024, 5, 5, 10, 0),
         joined=datetime(2024, 6, 1, 10, 0), enabled=True, email="opal.sanchez@company.com"),
    User(id=42, staff_id="STF042", name="Pete Morris", created=datetime(2024, 5, 20, 11, 30),
         joined=datetime(2024, 6, 10, 11, 30), enabled=True, email="pete.morris@company.com"),
    User(id=43, staff_id="STF043", name="Quincy Rogers", created=datetime(2024, 6, 1, 13, 0),
         joined=datetime(2024, 6, 20, 13, 0), enabled=True, email="quincy.rogers@company.com"),
    User(id=44, staff_id="STF044", name="Rose Reed", created=datetime(2024, 6, 15, 9, 30),
         joined=datetime(2024, 7, 1, 9, 30), enabled=False, email="rose.reed@company.com"),
    User(id=45, staff_id="STF045", name="Steve Cook", created=datetime(2024, 7, 1, 15, 45),
         joined=datetime(2024, 7, 20, 15, 45), enabled=True, email="steve.cook@company.com"),
    User(id=46, staff_id="STF046", name="Tara Morgan", created=datetime(2024, 7, 15, 8, 0),
         joined=datetime(2024, 8, 1, 8, 0), enabled=True, email="tara.morgan@company.com"),
    User(id=47, staff_id="STF047", name="Ulysses Bell", created=datetime(2024, 8, 1, 12, 15),
         joined=datetime(2024, 8, 20, 12, 15), enabled=True, email="ulysses.bell@company.com"),
    User(id=48, staff_id="STF048", name="Vera Murphy", created=datetime(2024, 8, 15, 14, 0),
         joined=datetime(2024, 9, 1, 14, 0), enabled=True, email="vera.murphy@company.com"),
    User(id=49, staff_id="STF049", name="Wade Bailey", created=datetime(2024, 9, 1, 10, 45),
         joined=datetime(2024, 9, 20, 10, 45), enabled=False, email="wade.bailey@company.com"),
    User(id=50, staff_id="STF050", name="Xena Rivera", created=datetime(2024, 9, 15, 13, 30),
         joined=datetime(2024, 10, 1, 13, 30), enabled=True, email="xena.rivera@company.com"),
]
todos = [
    Todo(id=1, todo="Review quarterly budget report", date=datetime(2024, 10, 1, 9, 0), done=True),
    Todo(id=2, todo="Schedule team meeting for project kickoff", date=datetime(2024, 10, 2, 10, 30), done=True),
    Todo(id=3, todo="Update client presentation slides", date=datetime(2024, 10, 3, 14, 0), done=True),
    Todo(id=4, todo="Fix bug in authentication module", date=datetime(2024, 10, 4, 11, 15), done=False),
    Todo(id=5, todo="Prepare training materials for new hires", date=datetime(2024, 10, 5, 13, 30), done=True),
    Todo(id=6, todo="Review pull requests from development team", date=datetime(2024, 10, 6, 15, 45), done=False),
    Todo(id=7, todo="Conduct performance review with team members", date=datetime(2024, 10, 7, 9, 30), done=True),
    Todo(id=8, todo="Research new project management tools", date=datetime(2024, 10, 8, 12, 0), done=False),
    Todo(id=9, todo="Update documentation for API endpoints", date=datetime(2024, 10, 9, 10, 0), done=True),
    Todo(id=10, todo="Organize team building activity", date=datetime(2024, 10, 10, 16, 0), done=False),
    Todo(id=11, todo="Respond to customer support tickets", date=datetime(2024, 10, 11, 8, 30), done=True),
    Todo(id=12, todo="Optimize database queries for performance", date=datetime(2024, 10, 12, 14, 30), done=False),
    Todo(id=13, todo="Create social media content calendar", date=datetime(2024, 10, 13, 11, 0), done=True),
    Todo(id=14, todo="Audit security protocols", date=datetime(2024, 10, 14, 13, 15), done=False),
    Todo(id=15, todo="Plan Q4 marketing campaign", date=datetime(2024, 10, 15, 10, 45), done=True),
    Todo(id=16, todo="Review and approve expense reports", date=datetime(2024, 10, 16, 9, 0), done=True),
    Todo(id=17, todo="Coordinate with design team on new logo", date=datetime(2024, 10, 17, 15, 30), done=False),
    Todo(id=18, todo="Test new feature in staging environment", date=datetime(2024, 10, 18, 12, 45), done=True),
    Todo(id=19, todo="Write blog post about industry trends", date=datetime(2024, 10, 19, 14, 0), done=False),
    Todo(id=20, todo="Attend virtual conference on AI developments", date=datetime(2024, 10, 20, 9, 30), done=True),
    Todo(id=21, todo="Update employee handbook", date=datetime(2024, 10, 21, 11, 30), done=False),
    Todo(id=22, todo="Schedule equipment maintenance", date=datetime(2024, 10, 22, 8, 0), done=True),
    Todo(id=23, todo="Prepare monthly financial report", date=datetime(2024, 10, 23, 13, 0), done=False),
    Todo(id=24, todo="Conduct user testing session", date=datetime(2024, 10, 24, 10, 15), done=True),
    Todo(id=25, todo="Review competitor analysis report", date=datetime(2024, 10, 25, 15, 0), done=False),
    Todo(id=26, todo="Set up automated backup system", date=datetime(2024, 10, 26, 9, 45), done=True),
    Todo(id=27, todo="Draft partnership proposal", date=datetime(2024, 10, 27, 12, 30), done=False),
    Todo(id=28, todo="Organize office supply inventory", date=datetime(2024, 10, 28, 14, 15), done=True),
    Todo(id=29, todo="Review and update privacy policy", date=datetime(2024, 10, 29, 11, 0), done=False),
    Todo(id=30, todo="Create onboarding checklist for new employees", date=datetime(2024, 10, 30, 10, 0), done=True),
    Todo(id=31, todo="Analyze website traffic metrics", date=datetime(2024, 10, 31, 13, 45), done=False),
    Todo(id=32, todo="Implement two-factor authentication", date=datetime(2024, 11, 1, 9, 15), done=True),
    Todo(id=33, todo="Schedule server maintenance window", date=datetime(2024, 11, 2, 15, 30), done=False),
    Todo(id=34, todo="Create customer satisfaction survey", date=datetime(2024, 11, 3, 12, 0), done=True),
    Todo(id=35, todo="Update product roadmap", date=datetime(2024, 11, 4, 10, 30), done=False),
    Todo(id=36, todo="Negotiate vendor contracts", date=datetime(2024, 11, 5, 14, 45), done=True),
    Todo(id=37, todo="Design email newsletter template", date=datetime(2024, 11, 6, 11, 15), done=False),
    Todo(id=38, todo="Conduct security training session", date=datetime(2024, 11, 7, 9, 0), done=True),
    Todo(id=39, todo="Review code standards and best practices", date=datetime(2024, 11, 8, 13, 30), done=False),
    Todo(id=40, todo="Plan holiday office party", date=datetime(2024, 11, 9, 16, 0), done=True),
    Todo(id=41, todo="Update disaster recovery plan", date=datetime(2024, 11, 10, 8, 30), done=False),
    Todo(id=42, todo="Create video tutorial for product features", date=datetime(2024, 11, 11, 12, 15), done=True),
    Todo(id=43, todo="Review insurance coverage options", date=datetime(2024, 11, 12, 14, 0), done=False),
    Todo(id=44, todo="Optimize mobile app performance", date=datetime(2024, 11, 13, 10, 45), done=True),
    Todo(id=45, todo="Conduct employee satisfaction survey", date=datetime(2024, 11, 14, 9, 30), done=False),
    Todo(id=46, todo="Prepare investor presentation", date=datetime(2024, 11, 15, 15, 15), done=True),
    Todo(id=47, todo="Implement A/B testing framework", date=datetime(2024, 11, 16, 11, 30), done=False),
    Todo(id=48, todo="Review cloud infrastructure costs", date=datetime(2024, 11, 17, 13, 0), done=True),
    Todo(id=49, todo="Update terms of service document", date=datetime(2024, 11, 18, 10, 0), done=False),
    Todo(id=50, todo="Plan year-end company retreat", date=datetime(2024, 11, 19, 14, 30), done=True),
]


def _get_todo(todo: int):
    if todo > len(todos):
        raise HTTPException(404, "Todo not found")
    return todos[todo-1]


def _get_user(user: int):
    if user > len(users):
        raise HTTPException(404, "User not found")
    return users[user-1]


@app.get("/todo/{todo}")
def get_todo(todo: Annotated[int, Path(...)]) -> Todo:
    return _get_todo(todo)


@app.get("/user/{user}")
def get_user(user: Annotated[int, Path(...)]) -> User:
    return _get_user(user)


@app.post("/user", status_code=201)
def create_user(user: User) -> User:
    users.append(user)
    user.id = len(users)
    return user


@app.post("/todo", status_code=201)
def create_todo(todo: Todo) -> Todo:
    todos.append(todo)
    todo.id = len(todos)
    return todo


@app.patch("/todo", status_code=201)
def update_todo(todo: Todo) -> Todo:
    _todo = _get_todo(todo.id)
    todos[_todo.id-1] = todo
    return todo

@app.patch("/user", status_code=201)
def update_user(user: User) -> User:
    _user = _get_user(user.id)
    users[_user.id-1] = user
    return user


def calculate_offset(page: int, page_size: int) -> int:
    return (page - 1) * page_size


@app.get("/users/{page}/{page_size}")
def get_users(
        page: Annotated[int, Path(...)],
        page_size: Annotated[int, Path(...)]
) -> Page[User]:
    offset = calculate_offset(page, page_size)
    _users = users[offset:offset+page_size]

    return Page(
        page=_users,
        total_rows=len(users),
        current_page=page,
        rows_per_page=page_size,
    )


@app.get("/todo/{page}/{page_size}")
def get_todos(
        page: Annotated[int, Path(...)],
        page_size: Annotated[int, Path(...)]
) -> Page[Todo]:
    offset = calculate_offset(page, page_size)
    _todos = todos[offset:offset+page_size]

    return Page(
        page=_todos,
        total_rows=len(todos),
        current_page=page,
        rows_per_page=page_size,
    )


if __name__ == '__main__':
    import uvicorn

    uvicorn.run("main:app")
