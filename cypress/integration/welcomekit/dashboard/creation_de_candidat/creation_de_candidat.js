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
        
        cy.contains("Enregistrer")
            .should('be.enabled')
            .click();

        cy.wait('@enregistrement')
            .should('have.property', "status", 201)

        cy.url()
            .should('include','/dashboard/o/dkxzma3/jobs/2XMOI_yq66e6b')
        
        cy.get('li.card-thumbnail-name').first()
            .should('have.text','Fleur Delisse');
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

    it('vérifie la validité de l\'adresse email', function () {
        cy.get("input[name='firstname']").type("Fleur")
        cy.get("input[name='lastname']").type("Delisse")

        cy.get("input[name='email']").type("nom@mauvaisformat")
        cy.contains("Enregistrer")
            .should('be.disabled')

        cy.get("input[name='email']").clear().type("nom@bonformat.com")
        cy.contains("Enregistrer")
            .should('be.enabled')

        cy.get("input[name='email']").clear()
        cy.contains("Enregistrer")
            .should('be.disabled')
    })  
    
    it('vérifie l\'upload de fichiers', () => {
        cy.fixture('text.txt', 'base64').then(fileContent => {
            cy.get("input[name='image']")
            .upload({ fileContent, fileName: 'text.txt', mimeType: 'text/plain' }, { subjectType: 'input' });
        });
        cy.get('span.error-message')
            .should('be.visible')
            .and('have.text', 'Fichiers autorisés: jpg, jpeg, png, gif')
        
        cy.fixture('text.txt').then(fileContent => {
            cy.get("input[name='image']")
            .upload({ fileContent, fileName: 'logo.png', mimeType: 'image/png' }, { subjectType: 'input' });
        });

        cy.get('span.error-message')
            .should('not.exist')
    });
})


