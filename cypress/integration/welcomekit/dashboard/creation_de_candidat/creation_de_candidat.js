describe('Le formulaire de création de candidat', function () {

    beforeEach(() => {
        cy.server()
        cy.route('POST', '/api/v1/dashboard/candidates').as('enregistrement')
        cy.login();
        cy.visit('/dashboard/o/dkxzma3/jobs/2XMOI_yq66e6b/new-candidate/392777');
    });

    it('permet de créer un candidat avec un nom prénom et email', function () {

        cy.server()
        cy.route('POST','/api/v1/dashboard/candidates').as('enregistrement')

        cy.get("input[name='firstname']").type("Fleur")
        cy.get("input[name='lastname']").type("Delisse")
        cy.get("input[name='email']").type("fleur.delisse@yahoo.fr")
        cy.contains("Enregistrer").click();
        cy.wait('@enregistrement')
            .should('have.property', "status", 201)
    })
})


