describe('Le formulaire de création de candidat', function () {

    beforeEach(() => {
        cy.server()
        cy.route({
            method: 'POST',
            url: '/api/v1/dashboard/candidates',            
        }).as('enregistrement')          
        cy.login();
        cy.visit('/dashboard/o/dkxzma3/jobs/2XMOI_yq66e6b/new-candidate/392777');
    });

    it('permet de créer un candidat avec un nom prénom et email', function () {
        cy.get("input[name='firstname']").type("Fleur")
        cy.get("input[name='lastname']").type("Delisse")
        cy.get("input[name='email']").type("fleur.delisse@yahoo.fr")
        cy.contains("Enregistrer").click();
        cy.wait('@enregistrement')
            .should('have.property', "status", 201)
    })

    it('affiche un message d\'erreur quand le serveur refuse l\'enregistrement (erreur 500)', function () {
        cy.route({
            method: 'POST',
            url: '/api/v1/dashboard/candidates',
            response: {
                status: "ko"
            },
            status: 500,
        }).as('enregistrement')  
        cy.get("input[name='firstname']").type("Fleur")
        cy.get("input[name='lastname']").type("Delisse")
        cy.get("input[name='email']").type("fleur.delisse@yahoo.fr")
        cy.contains("Enregistrer").click();
        cy.wait('@enregistrement')
            .should('have.property', "status", 500);
        cy.get("div[kind='error']")
            .should("contain.text","Impossible de créer ce candidat.")
            .and("contain.text","500: Internal Server Error")
    })
})


