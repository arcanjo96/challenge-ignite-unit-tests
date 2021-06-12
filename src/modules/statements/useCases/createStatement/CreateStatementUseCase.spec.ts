import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let createStatementUseCase: CreateStatementUseCase;
let usersRepository: IUsersRepository;;
let statementsRepository: IStatementsRepository;

enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
}

describe("Create Statement Use Case", () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        statementsRepository = new InMemoryStatementsRepository();
        createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository);
    });

    it("should be able create a new statement", async () => {
        const user = await usersRepository.create({
            email: "teste@teste.com",
            name: "Teste",
            password: "teste"
        });

        const statement = await createStatementUseCase.execute({
            user_id: user.id as string,
            type: OperationType.DEPOSIT,
            amount: 100,
            description: "Testing deposit"
        });

        expect(statement).toHaveProperty("id");
    });

    it("should be able create a new withdraw statement", async () => {
        const user = await usersRepository.create({
            email: "teste@teste.com",
            name: "Teste",
            password: "teste"
        });

        const statementDeposit = await createStatementUseCase.execute({
            user_id: user.id as string,
            type: OperationType.DEPOSIT,
            amount: 100,
            description: "Testing deposit"
        });

        const statementWithdraw = await createStatementUseCase.execute({
            user_id: user.id as string,
            type: OperationType.WITHDRAW,
            amount: 100,
            description: "Testing withdraw"
        });

        expect(statementWithdraw).toHaveProperty("id");
    });

    it("should not be able create a new statement withdraw with insufficient funds", () => {
        expect(async () => {
            const user = await usersRepository.create({
                email: "teste@teste.com",
                name: "Teste",
                password: "teste"
            });
    
            await createStatementUseCase.execute({
                user_id: user.id as string,
                type: OperationType.WITHDRAW,
                amount: 100,
                description: "Testing withdraw"
            });
        }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
    });
});