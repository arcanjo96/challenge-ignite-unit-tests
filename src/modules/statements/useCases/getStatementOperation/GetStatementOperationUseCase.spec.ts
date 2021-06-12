import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let getStatementOperationUseCase: GetStatementOperationUseCase;
let usersRepository: IUsersRepository;;
let statementsRepository: IStatementsRepository;
const BALANCE_EMPTY = 0;

enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
}

describe("Get Statement Operation", () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        statementsRepository = new InMemoryStatementsRepository();
        getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepository, statementsRepository);
    });

    it("should be able list statement by id", async () => {
        const user = await usersRepository.create({
            email: "teste@teste.com",
            name: "Teste",
            password: "teste"
        });

        const statement = await statementsRepository.create({
            user_id: user.id as string,
            type: OperationType.DEPOSIT,
            amount: 100,
            description: "Testing deposit"
        });

        const statementOperation = await getStatementOperationUseCase.execute({
            user_id: user.id as string,
            statement_id: statement.id as string
        });

        expect(statementOperation.type).toBe(OperationType.DEPOSIT);
        expect(statementOperation.user_id).toBe(user.id);
    });

    it("should not be able list statement if user not found", () => {
        expect(async () => {
            await getStatementOperationUseCase.execute({
                user_id: "teste",
                statement_id: "testando"
            });
        }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
    });

    it("should not be able list statement if statement not found", () => {
        expect(async () => {
            const { id } = await usersRepository.create({
                email: "teste@teste.com",
                name: "Teste",
                password: "teste"
            }); 
            await getStatementOperationUseCase.execute({
                user_id: id as string,
                statement_id: "testando"
            });
        }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
    });
});