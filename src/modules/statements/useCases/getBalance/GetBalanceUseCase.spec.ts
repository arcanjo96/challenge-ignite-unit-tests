import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let getBalanceUseCase: GetBalanceUseCase;
let usersRepository: IUsersRepository;;
let statementsRepository: IStatementsRepository;
const BALANCE_EMPTY = 0;

enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
}

describe("Get Balance", () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        statementsRepository = new InMemoryStatementsRepository();
        getBalanceUseCase = new GetBalanceUseCase(statementsRepository, usersRepository);
    });

    it("should be able list all statements by user", async () => {
        const user = await usersRepository.create({
            email: "teste@teste.com",
            name: "Teste",
            password: "teste"
        });

        await statementsRepository.create({
            user_id: user.id as string,
            type: OperationType.DEPOSIT,
            amount: 100,
            description: "Testing deposit"
        });

        await statementsRepository.create({
            user_id: user.id as string,
            type: OperationType.WITHDRAW,
            amount: 100,
            description: "Testing withdraw"
        });

        const { balance } = await getBalanceUseCase.execute({
            user_id: user.id as string
        });

        expect(balance).toBe(BALANCE_EMPTY);
    });

    it("should not be able list all statements if user not found", async () => {
        expect(async () => {
            const { balance } = await getBalanceUseCase.execute({
                user_id: "teste"
            });
        }).rejects.toBeInstanceOf(GetBalanceError);
    });
});