/// <reference types="cypress" />

describe('Listar usuários', () => {
    it('Listar usuários', () => {
        cy.GET('usuarios', true).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body.quantidade).to.have.greaterThan(4)
            expect(response.duration).to.be.lessThan(20)
        })
    });
})

describe('Cadastro de usuários', () => {
    it('Status Code 201', () => {
        let nome = `Pessoa nº ${Math.floor(Math.random() * 100000000)}`
        let email = `pessoa${Math.floor(Math.random() * 100000000)}@qa.com.br`

        cy.POST('usuarios', nome, email, 'teste', 'true', true).then((responsePOST) => {
            expect(responsePOST.res.status).to.equal(201)
            expect(responsePOST.res.body.message).to.equal('Cadastro realizado com sucesso')
        })
    });

    it('Status Code 400 (Funcional)', () => {
        cy.POST('usuarios', 'Fulano da Silva', 'beltrano@qa.com.br', 'teste', 'true', false).then((responsePOST) => {
            expect(responsePOST.res.status).to.equal(400)
            expect(responsePOST.res.body.message).to.equal('Este email já está sendo usado')
        })
    });

    it('Status Code 400 (Contrato)', () => {
        let nome = `Pessoa nº ${Math.floor(Math.random() * 100000000)}`
        let email = `pessoa${Math.floor(Math.random() * 100000000)}@qa.com.br`

        cy.POST('usuarios', nome, email, null, 'true', false).then((responsePOST) => {
            expect(responsePOST.res.status).to.equal(400)
            expect(responsePOST.res.body.password).to.equal('password deve ser uma string')
        })
    });
})

describe('Buscar usuários', () => {
    it('Status Code 200', () => {
        let nome = `Pessoa nº ${Math.floor(Math.random() * 100000000)}`
        let email = `pessoa${Math.floor(Math.random() * 100000000)}@qa.com.br`

        cy.POST('usuarios', nome, email, 'teste', 'true', true).then((responsePOST) => {
            cy.GET('usuarios/' + responsePOST.id, true).then((responseGET) => {
                expect(responseGET.status).to.equal(200)
                expect(responseGET.body._id).to.equal(responsePOST.id)
            })
        })
    });

    it('Status Code 400', () => {
        cy.GET('usuarios/0kI4P2KUmB3RZkGX', false).then((responseGET) => {
            expect(responseGET.status).to.equal(400)
            expect(responseGET.body.message).to.equal('Usuário não encontrado')
        })
    });
})

describe('Editar usuários', () => {
    it('Status Code - 200 (Edita já existente)', () => {
        let nome = `Pessoa nº ${Math.floor(Math.random() * 100000000)}`
        let email = `pessoa${Math.floor(Math.random() * 100000000)}@qa.com.br`

        cy.POST('usuarios', nome, email, 'teste', 'true', true).then((responsePOST) => {
            let nomeEdit = `Pessoa EDITADA nº ${Math.floor(Math.random() * 100000000)}`
            let emailEdit = `pessoaEditada${Math.floor(Math.random() * 100000000)}@qa.com.br`

            cy.PUT('usuarios/' + responsePOST.id, nomeEdit, emailEdit, 'teste', 'true', true).then((responsePUT) => {
                expect(responsePUT.status).to.equal(200)
                expect(responsePUT.body.message).to.equal('Registro alterado com sucesso')
            })
        })
    })

    it('Status Code - 200 (Cadastra se nâo existir)', () => {
        let nome = `Pessoa nº ${Math.floor(Math.random() * 100000000)}`
        let email = `pessoa${Math.floor(Math.random() * 100000000)}@qa.com.br`

        cy.PUT('usuarios/id', nome, email, 'teste', 'true', true).then((response) => {
            expect(response.status).to.equal(201)
            expect(response.body.message).to.equal('Cadastro realizado com sucesso')
        })
    })

    it('Satus Code - 400 (Email duplicado)', () => {
        let nome = `Pessoa nº ${Math.floor(Math.random() * 100000000)}`

        cy.PUT('usuarios/id', nome, 'carlos.henrique@qa.com.br', 'teste', 'true', false).then((response) => {
            expect(response.status).to.equal(400)
            expect(response.body.message).to.equal('Este email já está sendo usado')
        })
    })

    it('Status Code - 400 (Contrato)', () => {
        let nome = `Pessoa nº ${Math.floor(Math.random() * 100000000)}`
        let email = `pessoa${Math.floor(Math.random() * 100000000)}@qa.com.br`

        cy.PUT('usuarios/id', nome, email, null, 'true', false).then((response) => {
            expect(response.status).to.equal(400)
            expect(response.body.password).to.equal('password deve ser uma string')
        })
    })
})

describe('Excluir usuários', () => {
    it('Status Code - 200 (Excluido com sucesso)', () => {
        let nome = `Pessoa nº ${Math.floor(Math.random() * 100000000)}`
        let email = `pessoa${Math.floor(Math.random() * 100000000)}@qa.com.br`

        cy.POST('usuarios', nome, email, 'teste', 'true', true).then((responsePOST) => {
            let nomeEdit = `Pessoa EDITADA nº ${Math.floor(Math.random() * 100000000)}`
            let emailEdit = `pessoaEditada${Math.floor(Math.random() * 100000000)}@qa.com.br`

            cy.DELETE('usuarios/' + responsePOST.id, true).then((responseDELETE) => {
                expect(responseDELETE.status).to.equal(200)
                expect(responseDELETE.body.message).to.equal('Registro excluído com sucesso')
            })
        })
    })

    it('Status Code - 200 (Nenhum resgistro excluido)', () => {
        cy.DELETE('usuarios/id', true).then((responseDELETE) => {
            expect(responseDELETE.status).to.equal(200)
            expect(responseDELETE.body.message).to.equal('Nenhum registro excluído')
        })
    })

    it('Status Code - 400 (Carrinho ativo)', () => {
        cy.DELETE('usuarios/oUb7aGkMtSEPf6BZ', false).then((responseDELETE) => {
            expect(responseDELETE.status).to.equal(400)
            expect(responseDELETE.body.message).to.equal('Não é permitido excluir usuário com carrinho cadastrado')
        })
    })
})