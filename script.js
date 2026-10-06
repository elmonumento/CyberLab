"use strict";

const STORAGE_KEY = "cyberlab-progress-v1";
const QUIZ_QUESTION_COUNT = 5;
const PASSING_SCORE = 4;
const QUIZ_REWARD = 100;
const CHALLENGE_REWARD = 10;

const modules = [
  {
    id: "sql",
    number: "01",
    category: "WEB",
    title: "Injection SQL",
    description: "Repérer les entrées non fiables, comprendre le risque d'injection et choisir des protections adaptées.",
    objectives: ["Expliquer la différence entre code SQL et données utilisateur.", "Choisir les requêtes paramétrées pour les valeurs.", "Appliquer le moindre privilège et protéger les erreurs."],
    practice: {
      heading: "Mise en situation : filtre de recherche",
      paragraphs: [
        "Imagine une page de catalogue qui cherche un produit à partir d'un mot-clé. La recherche est légitime; le problème apparaît si le serveur assemble le texte SQL en y collant la valeur reçue du navigateur.",
        "Trace le flux en trois étapes : entrée utilisateur, fonction de recherche côté serveur, requête envoyée à la base. Repère à quel endroit une valeur devient potentiellement de la syntaxe, puis décris comment la remplacer par un paramètre lié.",
        "Avant de valider la conception, vérifie également les permissions SQL du compte de l'application et assure-toi que les messages d'erreur ne révèlent ni requête interne ni secret. Cet exercice est une revue de conception : aucune requête n'est exécutée.",
      ],
    },
    lessons: [
      {
        heading: "Une requête, deux types d'informations",
        paragraphs: [
          "Une application transmet souvent des requêtes SQL à une base de données. Une requête sûre distingue l'instruction écrite par l'application des valeurs fournies par les utilisateurs.",
          "Un risque d'injection apparaît quand une valeur externe est concaténée directement dans le texte d'une requête. La base peut alors interpréter une partie de cette valeur comme de la syntaxe SQL.",
        ],
        example: 'À éviter : "SELECT * FROM users WHERE name = \'" + name + "\'"',
      },
      {
        heading: "Utiliser des requêtes paramétrées",
        paragraphs: [
          "Une requête préparée définit sa structure séparément des valeurs. La bibliothèque de base de données transmet ensuite les paramètres comme des données, au lieu de les exécuter comme de la syntaxe.",
          "Les paramètres protègent les valeurs. Les noms de table et de colonne ne peuvent généralement pas être passés de la même manière : si ces éléments doivent varier, choisis-les dans une liste fixe de valeurs autorisées.",
        ],
        example: "À privilégier : SELECT * FROM users WHERE name = ?\nValeur liée séparément : name",
      },
      {
        heading: "Réduire l'impact et vérifier",
        paragraphs: [
          "Le compte de base de données de l'application devrait avoir uniquement les permissions nécessaires à son rôle. Une interface publique n'a habituellement pas besoin de créer des comptes SQL ou de modifier le schéma.",
          "Masque les détails internes dans les erreurs présentées aux utilisateurs. Dans un environnement de test autorisé, vérifie les comportements attendus et examine les journaux sans y enregistrer de secrets.",
        ],
      },
    ],
    quiz: [
      { question: "Quel est le risque principal d'une concaténation directe dans une requête ?", options: ["La valeur peut être interprétée comme une partie de la syntaxe SQL.", "La base choisit automatiquement une autre langue.", "La requête devient toujours plus lente."], correct: 0, explanation: "Les données non fiables peuvent modifier la structure de la requête si elles sont incorporées directement à son texte." },
      { question: "À quoi sert principalement un paramètre de requête préparée ?", options: ["À donner tous les droits d'administration au compte.", "À séparer les valeurs utilisateur de la syntaxe SQL.", "À remplacer les sauvegardes de la base."], correct: 1, explanation: "Les valeurs liées sont envoyées comme données, séparément de la structure SQL préparée." },
      { question: "Comment choisir une colonne de tri lorsque son nom varie ?", options: ["Concaténer le nom fourni par le navigateur.", "Désactiver toutes les protections de la base.", "Choisir dans une liste fermée de colonnes autorisées."], correct: 2, explanation: "Les identifiants SQL ne sont pas toujours paramétrables comme des valeurs : une liste fixe autorisée évite de faire confiance à un identifiant arbitraire." },
      { question: "Quel principe appliquer au compte SQL de l'application ?", options: ["Lui accorder uniquement les permissions nécessaires.", "Lui donner tous les droits pour simplifier le déploiement.", "Partager son mot de passe avec les utilisateurs."], correct: 0, explanation: "Le moindre privilège limite les conséquences d'une erreur ou d'une compromission." },
      { question: "Que devrait contenir une erreur destinée à un utilisateur final ?", options: ["Le mot de passe SQL et la requête complète.", "Un message utile mais sans détails internes sensibles.", "Le contenu intégral des journaux serveur."], correct: 1, explanation: "Les détails techniques doivent rester dans des journaux internes protégés, qui eux-mêmes ne doivent pas contenir de secrets inutiles." },
    ],
  },
  {
    id: "xss",
    number: "02",
    category: "WEB",
    title: "Cross-site scripting",
    description: "Comprendre comment une donnée affichée dans une page peut devenir active et comment la traiter selon son contexte.",
    objectives: ["Repérer une source de données non fiable et son point d'affichage.", "Choisir une insertion qui correspond au contexte de rendu.", "Décrire le rôle complémentaire d'une CSP."],
    practice: {
      heading: "Mise en situation : fil de commentaires",
      paragraphs: [
        "Un fil de discussion affiche le nom du profil et le commentaire de chaque personne. Dresse la liste des valeurs externes et indique où chacune apparaît dans l'interface.",
        "Pour une version qui n'accepte que du texte, choisis des API DOM textuelles. Si un besoin produit impose du texte enrichi, définis d'abord précisément les éléments autorisés, puis sélectionne un assainisseur maintenu.",
        "Ajoute au plan de vérification les variantes de rendu : profil, aperçu, recherche et mobile. La CSP est une défense additionnelle; elle ne remplace pas le traitement sûr à chaque point d'insertion.",
      ],
    },
    lessons: [
      {
        heading: "Quand une donnée devient du contenu actif",
        paragraphs: [
          "Une faille XSS survient lorsqu'une page traite une donnée contrôlée par une personne comme du contenu actif dans le navigateur d'une autre personne.",
          "Les données peuvent venir d'un formulaire, d'un profil, d'une URL ou d'une source externe. Le risque dépend de la façon dont elles sont insérées : texte HTML, attribut, URL ou code JavaScript.",
        ],
      },
      {
        heading: "Encoder selon le contexte",
        paragraphs: [
          "Pour afficher un commentaire comme du texte, préfère une API textuelle telle que textContent. Elle n'interprète pas la chaîne fournie comme du balisage.",
          "L'encodage doit correspondre à l'endroit où la valeur est utilisée. Pour créer du HTML riche, utilise un assainisseur éprouvé, configuré pour n'autoriser que les éléments et attributs nécessaires. Évite les gestionnaires d'événements en ligne et les constructions dangereuses.",
        ],
        example: "Affichage texte : element.textContent = commentaire",
      },
      {
        heading: "Ajouter des défenses en profondeur",
        paragraphs: [
          "Une Content Security Policy bien conçue peut réduire l'impact de certaines injections, mais ne remplace ni l'encodage correct ni l'assainissement adapté.",
          "Vérifie les composants qui réaffichent des commentaires, titres ou profils. Les tests doivent utiliser une application et des données de démonstration autorisées, jamais un site tiers.",
        ],
      },
    ],
    quiz: [
      { question: "Comment afficher un commentaire comme du texte avec l'API DOM ?", options: ["Avec innerHTML sans validation.", "Avec textContent.", "Avec une chaîne ajoutée dans une balise script."], correct: 1, explanation: "textContent insère le contenu comme du texte et ne l'analyse pas comme du HTML." },
      { question: "Pourquoi l'encodage dépend-il du contexte ?", options: ["Les règles diffèrent selon qu'une valeur est dans du texte, un attribut ou une URL.", "Toutes les valeurs doivent être encodées uniquement pour les URL.", "L'encodage ne sert qu'à choisir une police."], correct: 0, explanation: "Un encodage adapté au contexte empêche le navigateur de confondre les données avec une structure active." },
      { question: "Le contenu saisi doit être affiché comme du HTML riche. Quelle approche convient ?", options: ["Autoriser toutes les balises et tous les attributs.", "Le placer dans innerHTML tel quel.", "Utiliser un assainisseur maintenu et une liste d'éléments autorisés."], correct: 2, explanation: "Pour le HTML riche, un assainisseur réputé et une politique restrictive sont préférables à l'insertion directe." },
      { question: "Quel rôle une Content Security Policy joue-t-elle ?", options: ["Elle remplace toute validation et tout encodage.", "Elle ajoute une défense en profondeur sans corriger à elle seule la source.", "Elle rend publiques les données privées."], correct: 1, explanation: "La CSP réduit certaines possibilités d'exécution, mais il faut toujours traiter sûrement les données à leur point d'insertion." },
      { question: "Où tester la gestion d'un commentaire potentiellement dangereux ?", options: ["Dans un laboratoire ou une application que tu es autorisé à tester.", "Sur le premier site public trouvé.", "Sur un compte appartenant à une autre personne."], correct: 0, explanation: "Les tests doivent rester dans un environnement local, de démonstration ou explicitement autorisé." },
    ],
  },
  {
    id: "passwords",
    number: "03",
    category: "IDENTITÉ",
    title: "Mots de passe et authentification",
    description: "Stocker les secrets avec soin, protéger les sessions et renforcer les connexions.",
    objectives: ["Distinguer le hachage d'un chiffrement réversible.", "Identifier les protections d'une session et d'une récupération de compte.", "Proposer une authentification multifacteur adaptée."],
    practice: {
      heading: "Mise en situation : concevoir la création de compte",
      paragraphs: [
        "Une application doit créer un compte, ouvrir une session et permettre la récupération d'accès. Repère les moments où un mot de passe ou un jeton sensible existe et limite sa durée d'exposition.",
        "Décris le stockage du mot de passe avec une fonction de hachage dédiée et un sel unique. Pour la session, prévois la rotation de l'identifiant après connexion et un cookie HTTPS avec Secure, HttpOnly et une politique SameSite adaptée.",
        "Enfin, vérifie que le jeton de récupération expire et ne fonctionne qu'une fois. Ne journalise jamais de mot de passe, de code temporaire ou de jeton de session.",
      ],
    },
    lessons: [
      {
        heading: "Ne jamais enregistrer un mot de passe en clair",
        paragraphs: [
          "Une base de comptes ne devrait pas conserver de mots de passe en texte lisible ni utiliser un chiffrement réversible pour les vérifier.",
          "Utilise une fonction de hachage spécifiquement conçue pour les mots de passe, par exemple Argon2id, scrypt ou bcrypt, avec les paramètres recommandés par une bibliothèque maintenue. Une valeur aléatoire différente par mot de passe, appelée sel, empêche de réutiliser directement des tables précalculées.",
        ],
      },
      {
        heading: "Concevoir une connexion résistante",
        paragraphs: [
          "Les limites de tentatives et les alertes contre les connexions suspectes peuvent réduire les attaques automatisées. Les messages de connexion et de récupération devraient éviter de révéler si une adresse possède un compte.",
          "L'authentification multifacteur ajoute une protection si un mot de passe est découvert. Un gestionnaire de mots de passe aide à créer et conserver des mots de passe longs et uniques.",
        ],
      },
      {
        heading: "Protéger les sessions et la récupération",
        paragraphs: [
          "Après une connexion réussie, renouvelle l'identifiant de session. Les cookies de session devraient utiliser Secure sur HTTPS, HttpOnly et une politique SameSite appropriée.",
          "Les liens de réinitialisation doivent être difficiles à deviner, temporaires et utilisables une seule fois. Ne demande jamais aux personnes de transmettre leur mot de passe par courriel ou par message.",
        ],
      },
    ],
    quiz: [
      { question: "Comment stocker le vérificateur d'un mot de passe ?", options: ["En texte clair dans la base.", "Avec un hachage lent adapté aux mots de passe et un sel unique.", "Avec un chiffrement réversible dont la clé est publique."], correct: 1, explanation: "Un hachage dédié comme Argon2id, scrypt ou bcrypt, avec un sel unique, est la pratique habituelle." },
      { question: "À quoi sert un sel unique par mot de passe ?", options: ["À rendre identiques tous les mots de passe hachés.", "À remplacer le hachage par un chiffrement.", "À empêcher la réutilisation directe de tables précalculées entre comptes."], correct: 2, explanation: "Un sel unique rend le hachage différent même lorsque deux personnes choisissent le même mot de passe." },
      { question: "Pourquoi activer l'authentification multifacteur ?", options: ["Elle ajoute un facteur de vérification en plus du mot de passe.", "Elle rend inutile toute mise à jour.", "Elle permet de partager un compte en sécurité."], correct: 0, explanation: "Un second facteur peut bloquer une connexion lorsque le mot de passe seul a été compromis." },
      { question: "Quel réglage protège un cookie de session contre l'accès direct depuis JavaScript ?", options: ["Public.", "HttpOnly.", "Debug."], correct: 1, explanation: "HttpOnly empêche l'accès au cookie via les API JavaScript du navigateur. Secure et SameSite apportent d'autres protections complémentaires." },
      { question: "Quel comportement convient à un lien de récupération ?", options: ["Valide sans limite et réutilisable.", "Affiche le mot de passe actuel.", "Aléatoire, temporaire, à usage unique et transmis par un canal adapté."], correct: 2, explanation: "Un jeton de récupération doit être difficile à deviner, limité dans le temps et invalidé après usage." },
    ],
  },
  {
    id: "network",
    number: "04",
    category: "RÉSEAU",
    title: "Reconnaissance réseau — notions",
    description: "Découvrir les adresses, ports, DNS et services à travers des exemples fictifs et autorisés.",
    objectives: ["Distinguer adresse IP, port, nom DNS et protocole.", "Lire un inventaire de services fictif.", "Définir un périmètre et une autorisation avant un test."],
    practice: {
      heading: "Mise en situation : lire un inventaire fictif",
      paragraphs: [
        "Une documentation interne présente trois lignes : une application web, un résolveur DNS et un service de partage. Pour chaque ligne, identifie le rôle de l'hôte, le nom du service et les personnes qui en sont responsables.",
        "Construis une carte logique sur papier : quels échanges sont nécessaires entre les composants, et lesquels devraient être bloqués par défaut ? Justifie les flux attendus sans tenter de contacter une adresse réelle.",
        "Avant toute reconnaissance active dans un vrai environnement, il faudrait obtenir une autorisation explicite et préciser les systèmes concernés, les méthodes admises, les horaires et les conditions d'arrêt. Ce module ne lance aucun balayage.",
      ],
    },
    lessons: [
      {
        heading: "Adresses et services",
        paragraphs: [
          "Une adresse IP identifie une interface réseau pour acheminer des communications. Un numéro de port désigne généralement un service ou une application sur cette interface.",
          "DNS associe des noms à des informations réseau. Le protocole utilisé et sa configuration déterminent notamment si une connexion est chiffrée : un numéro de port ne chiffre pas, à lui seul, une communication.",
        ],
        example: "198.51.100.24 et 203.0.113.8 sont des adresses réservées aux exemples documentaires.",
      },
      {
        heading: "Lire une architecture",
        paragraphs: [
          "Dans un diagramme de réseau, identifie les rôles : client, serveur, routeur, pare-feu et services. Les segments réseau et les règles de filtrage déterminent quels échanges sont nécessaires.",
          "Le moindre privilège s'applique aussi au réseau : n'expose que les services requis et limite les communications entre zones. Conserve une documentation des actifs et de leur propriétaire.",
        ],
      },
      {
        heading: "Reconnaissance responsable",
        paragraphs: [
          "Avant toute observation active, obtiens une autorisation explicite qui précise les systèmes, méthodes, horaires et limites. Une adresse accessible publiquement n'est pas une autorisation de la tester.",
          "Dans ce cours, nous apprenons à interpréter un inventaire fictif : aucun balayage d'hôte ni aucune connexion à une machine réelle n'est exécuté.",
        ],
      },
    ],
    quiz: [
      { question: "Quel est le rôle général d'un port associé à une adresse IP ?", options: ["Remplacer le nom DNS.", "Identifier un service ou une application sur l'hôte.", "Garantir le chiffrement de la connexion."], correct: 1, explanation: "Le port aide à identifier le service visé sur une interface; il ne chiffre pas les données à lui seul." },
      { question: "Que fait principalement le DNS ?", options: ["Associer des noms de domaine à des informations réseau.", "Chiffrer tout le contenu d'une page web.", "Attribuer un mot de passe à un utilisateur."], correct: 0, explanation: "Le DNS aide les clients à retrouver les informations réseau associées à un nom." },
      { question: "À quoi servent les plages 198.51.100.0/24 et 203.0.113.0/24 ?", options: ["À désigner des réseaux privés à tester.", "À fournir des cibles publiques de formation.", "À illustrer des exemples dans la documentation."], correct: 2, explanation: "Ces plages sont réservées à la documentation et aux exemples." },
      { question: "Quand une reconnaissance active est-elle appropriée ?", options: ["Quand une machine répond sur Internet.", "Quand le propriétaire a explicitement autorisé et borné les tests.", "Quand l'adresse est facile à mémoriser."], correct: 1, explanation: "Il faut une autorisation explicite et un périmètre défini avant les tests actifs." },
      { question: "Quel est un bon principe pour les services réseau ?", options: ["Exposer uniquement les services nécessaires et contrôler les flux.", "Autoriser tout le trafic entrant par défaut.", "Partager une seule règle avec tous les réseaux."], correct: 0, explanation: "Réduire l'exposition et limiter les flux au besoin applique le moindre privilège au réseau." },
    ],
  },
  {
    id: "linux",
    number: "05",
    category: "LINUX",
    title: "Commandes Linux",
    description: "Lire les commandes courantes, comprendre les chemins et agir prudemment dans un terminal.",
    objectives: ["Reconnaître les commandes de navigation et de lecture.", "Expliquer le principe des permissions de fichiers.", "Évaluer les effets d'une commande avant exécution."],
    practice: {
      heading: "Mise en situation : revue avant une modification",
      paragraphs: [
        "Imagine un dossier de projet contenant les fichiers du site et ses documents de configuration. Décris comment confirmer ton répertoire courant, afficher son contenu et ouvrir un fichier de documentation sans le modifier.",
        "Avant toute commande qui change un fichier, lis les options et le chemin ciblé; préfère d'abord une opération de lecture seule. Vérifie ensuite que les permissions correspondent au propriétaire et au rôle du document.",
        "Ne copie jamais une commande inconnue avec des droits élevés pour la lancer sans la comprendre. Les commandes de ce scénario restent des exemples écrits : CyberLab ne les transmet pas au système.",
      ],
    },
    lessons: [
      {
        heading: "Se repérer dans les fichiers",
        paragraphs: [
          "Un terminal reçoit des commandes textuelles. `pwd` affiche le répertoire courant; `ls` en liste le contenu; `cd` change de répertoire.",
          "`cat` affiche le contenu d'un petit fichier. Pour un grand document, une commande de lecture paginée évite de remplir tout le terminal. Lis une commande et son chemin avant de l'exécuter.",
        ],
        example: "$ pwd\n$ ls\n$ cd documents",
      },
      {
        heading: "Chercher et comprendre les permissions",
        paragraphs: [
          "Les outils de recherche peuvent retrouver un mot dans des fichiers accessibles. Les permissions Linux indiquent quels utilisateurs peuvent lire, écrire ou exécuter un fichier.",
          "Accorde uniquement les permissions nécessaires. Un fichier sensible ne doit pas être lisible par tout le monde; les changements de permission doivent être justifiés et vérifiés.",
        ],
      },
      {
        heading: "Prudence avant d'exécuter",
        paragraphs: [
          "Certaines commandes modifient ou suppriment des fichiers. Vérifie toujours le répertoire courant, les arguments et les chemins; commence par une commande de lecture seule quand elle suffit.",
          "N'exécute pas une commande copiée depuis une source inconnue avec des droits élevés. Ici, les exemples sont du texte pédagogique : CyberLab n'exécute aucune commande système.",
        ],
      },
    ],
    quiz: [
      { question: "Que permet de connaître `pwd` ?", options: ["Le chemin du répertoire de travail courant.", "La liste des mots de passe enregistrés.", "L'adresse d'un serveur Internet."], correct: 0, explanation: "`pwd` affiche le chemin du répertoire courant dans le terminal." },
      { question: "Quelle commande sert à lister le contenu d'un répertoire ?", options: ["cd", "ls", "pwd"], correct: 1, explanation: "`ls` affiche les fichiers et répertoires visibles à l'emplacement demandé." },
      { question: "Que fait normalement `cd documents` ?", options: ["Change le répertoire courant vers documents si ce chemin existe.", "Supprime le dossier documents.", "Affiche les permissions de tous les utilisateurs."], correct: 0, explanation: "`cd` modifie le répertoire de travail du shell." },
      { question: "Avant d'exécuter une commande qui modifie des fichiers, que faut-il faire ?", options: ["L'exécuter en administrateur sans lire les arguments.", "La copier depuis un message inconnu.", "Vérifier les options, le chemin et l'effet attendu."], correct: 2, explanation: "Comprendre précisément l'effet d'une commande et de ses chemins permet d'éviter des modifications involontaires." },
      { question: "Que signifie le principe du moindre privilège pour les permissions ?", options: ["Accorder uniquement les accès nécessaires.", "Rendre tous les fichiers modifiables par tous.", "Utiliser systématiquement un compte administrateur."], correct: 0, explanation: "Limiter les droits réduit les conséquences d'une erreur ou d'un compte compromis." },
    ],
  },
  {
    id: "security",
    number: "06",
    category: "SÉCURITÉ",
    title: "Réflexes de sécurité",
    description: "Mettre en pratique les principes de risque, de mises à jour, de sauvegarde et de réponse aux incidents.",
    objectives: ["Distinguer confidentialité, intégrité et disponibilité.", "Prioriser les mises à jour et limiter l'exposition.", "Décrire les premières étapes d'une réponse à incident."],
    practice: {
      heading: "Mise en situation : préparer une petite équipe",
      paragraphs: [
        "Une petite équipe maintient une application avec des données de clients. Commence par nommer les informations et services essentiels, leurs propriétaires et les conséquences d'une indisponibilité ou d'une divulgation.",
        "Propose un rythme de mise à jour avec examen des avis, tests et retour arrière. Vérifie que les sauvegardes sont protégées et qu'un exercice de restauration confirme qu'elles fonctionnent.",
        "Pour un incident, identifie qui prévenir, où conserver les journaux utiles et comment limiter les accès selon la procédure de l'organisation. Ne publie pas de données supposées touchées et ne détruis pas les éléments d'analyse.",
      ],
    },
    lessons: [
      {
        heading: "Comprendre les objectifs de sécurité",
        paragraphs: [
          "La confidentialité limite la lecture des informations aux personnes autorisées. L'intégrité aide à s'assurer que les informations ne sont pas modifiées de façon inattendue. La disponibilité vise à maintenir l'accès nécessaire aux services.",
          "Le risque dépend d'un scénario de menace, d'une faiblesse possible et de ses conséquences. Un inventaire des actifs et des propriétaires aide à décider quoi protéger en priorité.",
        ],
      },
      {
        heading: "Réduire les vulnérabilités",
        paragraphs: [
          "Maintiens les systèmes et dépendances à jour, en évaluant les avis de sécurité et en testant les mises à jour selon leur impact. Retire les comptes et services inutiles.",
          "Protège les secrets hors du code source, limite leur accès et prévois une rotation lorsqu'ils ont pu être exposés. Des journaux protégés et des alertes pertinentes facilitent la détection.",
        ],
      },
      {
        heading: "Se préparer aux incidents",
        paragraphs: [
          "Des sauvegardes régulières ne sont utiles que si leur restauration a été testée. Conserve une copie protégée contre les modifications non autorisées.",
          "En cas d'incident, suis la procédure de ton organisation : préserve les informations utiles, informe les personnes responsables et limite la propagation sans effacer précipitamment les preuves.",
        ],
      },
    ],
    quiz: [
      { question: "Que cherche à préserver la disponibilité ?", options: ["L'accès nécessaire aux services.", "Le secret de tous les noms de fichiers.", "L'absence de toute mise à jour."], correct: 0, explanation: "La disponibilité signifie que les personnes autorisées peuvent accéder aux services quand elles en ont besoin." },
      { question: "Comment gérer un avis de mise à jour de sécurité ?", options: ["L'ignorer jusqu'à une panne.", "Évaluer son impact, tester le correctif puis le déployer de façon suivie.", "Publier les secrets du projet pour demander de l'aide."], correct: 1, explanation: "Évalue l'avis et le risque, applique un correctif approprié et vérifie son fonctionnement." },
      { question: "Comment vérifier qu'une sauvegarde permet réellement une reprise ?", options: ["En regardant uniquement son nom de fichier.", "En la copiant sur le poste de tout le monde.", "En testant périodiquement la restauration dans un cadre contrôlé."], correct: 2, explanation: "Un test de restauration confirme que la sauvegarde est exploitable et que la procédure est connue." },
      { question: "Où conserver un secret d'application ?", options: ["Dans un mécanisme de gestion de secrets avec accès limité.", "Dans un dépôt public pour ne pas l'oublier.", "Dans le nom d'une variable visible par tous."], correct: 0, explanation: "Les secrets doivent rester en dehors du dépôt et leur accès doit être restreint." },
      { question: "Quel est un bon réflexe initial en cas d'incident ?", options: ["Effacer immédiatement toute trace.", "Suivre la procédure, préserver les informations et prévenir les responsables.", "Annoncer publiquement les données supposées touchées avant vérification."], correct: 1, explanation: "Préserve les éléments utiles, suis la procédure et informe les personnes responsables selon les règles applicables." },
    ],
  },
];

const advancedQuiz = {
  sql: [
    { question: "Un filtre reçoit un nom de colonne choisi dans l'interface. Quelle conception reste sûre ?", options: ["Lier le nom comme une valeur SQL ordinaire.", "Choisir le nom dans une liste fixe côté serveur, puis l'utiliser dans la requête.", "Échapper quelques caractères et accepter n'importe quel nom."], correct: 1, explanation: "Les identifiants SQL ne sont pas nécessairement paramétrables; une liste fermée côté serveur contrôle les choix permis." },
    { question: "Une requête est paramétrée, mais le compte de base peut modifier toutes les tables. Quel contrôle manque ?", options: ["Le moindre privilège pour le compte applicatif.", "Un deuxième encodage HTML des valeurs SQL.", "Un port différent pour chaque utilisateur."], correct: 0, explanation: "Les permissions minimales réduisent l'impact d'une erreur, même si la requête utilise correctement des paramètres." },
    { question: "Pourquoi enregistrer une erreur SQL détaillée uniquement dans un journal protégé ?", options: ["Pour la rendre visible à tous les visiteurs.", "Pour éviter toute analyse du problème.", "Pour faciliter le diagnostic sans divulguer la structure interne à l'utilisateur."], correct: 2, explanation: "Le message public doit rester générique; les journaux contrôlés peuvent conserver le contexte utile sans secrets superflus." },
    { question: "Un test de sécurité d'une recherche doit-il être lancé sur un site public choisi au hasard ?", options: ["Oui, si la recherche est accessible sans compte.", "Non, seulement dans un environnement possédé ou explicitement autorisé.", "Oui, si aucune donnée n'est téléchargée."], correct: 1, explanation: "L'accessibilité publique ne constitue pas une autorisation de test. Utilise un laboratoire local ou un périmètre approuvé." },
    { question: "Quel scénario vérifie mieux une correction d'injection sans toucher à un vrai système ?", options: ["Exécuter des tests automatisés sur une base locale jetable et vérifier les résultats attendus.", "Réessayer sur plusieurs services Internet.", "Désactiver le journal et supprimer les sauvegardes."], correct: 0, explanation: "Des tests reproductibles sur un laboratoire isolé permettent de vérifier le comportement sans viser de systèmes tiers." },
  ],
  xss: [
    { question: "Un commentaire en texte brut est inséré dans un élément de page. Quelle API privilégier ?", options: ["textContent, afin de traiter la valeur comme du texte.", "innerHTML sans contrôle, pour conserver tout formatage.", "Une chaîne concaténée à un gestionnaire d'événement."], correct: 0, explanation: "textContent n'interprète pas le texte fourni comme du balisage HTML." },
    { question: "Une application a un besoin réel de texte enrichi. Quelle défense convient ?", options: ["Autoriser tout HTML puis compter uniquement sur la CSP.", "Assainir avec une bibliothèque maintenue et une liste autorisée restrictive.", "Désactiver les contrôles du navigateur."], correct: 1, explanation: "Un assainisseur éprouvé configuré de façon restrictive traite le besoin de HTML riche; la CSP reste une protection en profondeur." },
    { question: "Pourquoi le contexte d'insertion est-il important pour l'encodage ?", options: ["Le contexte n'a d'effet que sur la couleur.", "Une même chaîne est toujours sûre dans tous les contextes.", "Texte, attribut, URL et script ont des règles d'interprétation différentes."], correct: 2, explanation: "L'encodage doit correspondre au contexte exact; une méthode sûre pour le texte n'est pas interchangeable avec les autres." },
    { question: "Quel est le rôle d'une politique CSP bien configurée ?", options: ["Réduire certaines possibilités d'exécution, sans remplacer le traitement sûr des données.", "Corriger à elle seule toutes les sources XSS.", "Valider automatiquement chaque entrée du formulaire."], correct: 0, explanation: "La CSP est une couche de défense supplémentaire, pas une correction de la source ni du point d'insertion." },
    { question: "Un profil est affiché dans plusieurs composants. Que faut-il vérifier ?", options: ["Uniquement la page de profil initiale.", "Chaque point d'insertion et chaque contexte de rendu, y compris aperçus et recherche.", "Uniquement les comptes administrateurs."], correct: 1, explanation: "Une même donnée peut être réutilisée dans plusieurs contextes; chaque insertion doit être examinée et testée." },
  ],
  passwords: [
    { question: "Deux personnes choisissent le même mot de passe. Pourquoi un sel aléatoire distinct reste-t-il utile ?", options: ["Il rend les hachages différents et complique les attaques précalculées communes.", "Il permet de déchiffrer le mot de passe.", "Il remplace la limitation des tentatives de connexion."], correct: 0, explanation: "Un sel unique rend les vérificateurs différents, même pour des mots de passe identiques." },
    { question: "Quel mécanisme convient au stockage des vérificateurs de mots de passe ?", options: ["Un chiffrement réversible avec une clé partagée.", "Un hachage dédié et lent comme Argon2id, scrypt ou bcrypt, configuré correctement.", "Un hachage rapide sans sel."], correct: 1, explanation: "Un algorithme conçu pour les mots de passe ralentit les essais hors ligne; le sel doit être unique." },
    { question: "Que doit faire un service de récupération de compte ?", options: ["Envoyer le mot de passe actuel en clair.", "Créer un lien permanent réutilisable.", "Émettre un jeton imprévisible, temporaire et à usage unique."], correct: 2, explanation: "Un jeton de récupération doit être difficile à deviner, expirer et être invalidé après utilisation." },
    { question: "Quels attributs renforcent généralement un cookie de session HTTPS ?", options: ["Secure, HttpOnly et une politique SameSite adaptée.", "Public, Debug et Permanent.", "Un nom de cookie identique au mot de passe."], correct: 0, explanation: "Secure limite l'envoi à HTTPS, HttpOnly restreint l'accès JavaScript et SameSite aide contre certains envois intersites." },
    { question: "Que change l'authentification multifacteur ?", options: ["Elle supprime le besoin de protéger les sessions.", "Elle exige un facteur supplémentaire, mais n'empêche pas de sécuriser le reste du compte.", "Elle garantit qu'un appareil ne peut jamais être compromis."], correct: 1, explanation: "Un facteur supplémentaire réduit la dépendance au seul mot de passe, sans supprimer les autres contrôles nécessaires." },
  ],
  network: [
    { question: "Que peut-on conclure de la présence d'un port ouvert dans un inventaire fictif ?", options: ["Le service est forcément vulnérable.", "Le trafic est forcément chiffré.", "Un service semble écouter; son exposition et son besoin doivent être évalués dans le périmètre autorisé."], correct: 2, explanation: "Un port décrit un point de service, pas à lui seul son risque, son chiffrement ni l'autorisation de le tester." },
    { question: "Une équipe veut réaliser une observation active. Que doit préciser l'autorisation ?", options: ["Les systèmes, méthodes, période et limites de l'exercice.", "Uniquement le nom de l'outil à employer.", "La permission de tester toute adresse visible sur Internet."], correct: 0, explanation: "Un périmètre explicite et des règles d'engagement définissent les limites responsables du test." },
    { question: "Quel est le rôle du DNS dans un scénario réseau ?", options: ["Chiffrer les communications applicatives.", "Associer des noms à des informations réseau utilisées pour la résolution.", "Remplacer les règles du pare-feu."], correct: 1, explanation: "Le DNS permet notamment de résoudre un nom; le chiffrement dépend d'autres protocoles et configurations." },
    { question: "Une application web n'a besoin que d'un service entrant. Quel principe guide le pare-feu ?", options: ["Autoriser tous les ports par confort.", "Laisser chaque utilisateur ouvrir ses propres services.", "N'autoriser que le flux requis et contrôler le reste."], correct: 2, explanation: "Limiter les flux et l'exposition applique le moindre privilège à la segmentation réseau." },
    { question: "Pourquoi un port ne suffit-il pas à identifier le niveau de sécurité d'un service ?", options: ["Le port indique une destination, pas à lui seul la version, la configuration ou le chiffrement du service.", "Les ports sont des noms de personnes.", "Un port ouvert prouve toujours une intrusion."], correct: 0, explanation: "Il faut connaître le service et son contexte; le numéro seul ne prouve ni vulnérabilité ni chiffrement." },
  ],
  linux: [
    { question: "Quelle démarche est la plus prudente avant une commande qui pourrait supprimer des fichiers ?", options: ["Ajouter des privilèges élevés pour éviter les avertissements.", "Confirmer le répertoire et les chemins, lire les options, puis préférer une vérification non destructive.", "Exécuter la commande depuis n'importe quel dossier."], correct: 1, explanation: "Comprendre la cible et l'effet avant toute modification limite les erreurs; commence par une lecture seule quand c'est possible." },
    { question: "Pourquoi éviter de lancer une commande inconnue avec des privilèges administrateur ?", options: ["Les commandes administratives sont toujours plus lentes.", "Le terminal refuse toutes les commandes documentées.", "Une erreur ou une commande malveillante pourrait avoir un impact étendu."], correct: 2, explanation: "Les privilèges élevés agrandissent les conséquences possibles; comprends la commande et limite les droits." },
    { question: "Que signifie accorder une permission minimale à un fichier de configuration sensible ?", options: ["Limiter sa lecture et sa modification aux rôles qui en ont besoin.", "Rendre le fichier modifiable par tous.", "Renommer le fichier pour le cacher."], correct: 0, explanation: "Les permissions doivent correspondre au besoin réel, pas être élargies par commodité." },
    { question: "Comment examiner un dossier avant d'y agir ?", options: ["Utiliser une commande destructive pour voir ce qui se passe.", "Confirmer l'emplacement courant et lister ou lire les éléments sans les modifier.", "Exécuter chaque fichier trouvé."], correct: 1, explanation: "Des commandes d'inspection en lecture seule permettent de comprendre le contexte sans changer les fichiers." },
    { question: "Quelle pratique est la plus sûre lorsqu'une commande en ligne est inconnue ?", options: ["La copier avec sudo sans l'examiner.", "La lancer sur un dossier de production pour apprendre.", "Consulter une documentation de confiance, comprendre chaque option et l'essayer dans un environnement isolé si nécessaire."], correct: 2, explanation: "La vérification et un environnement isolé permettent de comprendre les effets avant d'agir." },
  ],
  security: [
    { question: "Une sauvegarde existe mais n'a jamais été restaurée en test. Quel risque demeure ?", options: ["On ne sait pas si elle est complète ni si la procédure de reprise fonctionne.", "La sauvegarde chiffre automatiquement toutes les données.", "Elle garantit que l'incident ne se reproduira pas."], correct: 0, explanation: "Un exercice de restauration vérifie l'intégrité de la copie et la capacité à reprendre les opérations." },
    { question: "Quel est le premier réflexe lors d'un incident suspect selon la procédure de l'organisation ?", options: ["Effacer immédiatement tous les journaux.", "Préserver les éléments utiles, prévenir les responsables et appliquer les consignes de réponse.", "Publier une conclusion avant de vérifier les faits."], correct: 1, explanation: "La préservation et l'escalade contrôlée aident à contenir et comprendre l'incident sans détruire les preuves." },
    { question: "Comment réduire le risque lié à un secret qui a pu être exposé ?", options: ["Le laisser dans l'historique du dépôt.", "Le renommer sans le renouveler.", "Révoquer ou renouveler le secret, puis vérifier les accès et retirer sa source d'exposition."], correct: 2, explanation: "Un secret potentiellement exposé doit être traité comme compromis; sa rotation doit s'accompagner d'un contrôle de l'exposition." },
    { question: "Pourquoi prioriser les mises à jour selon le risque et le contexte ?", options: ["Pour corriger les expositions importantes tout en testant l'impact et en vérifiant le déploiement.", "Pour appliquer toute mise à jour sans contrôle sur un système critique.", "Pour éviter de consulter les avis de sécurité."], correct: 0, explanation: "L'évaluation, les tests adaptés et la vérification réduisent le risque sans ignorer les contraintes opérationnelles." },
    { question: "Quel exemple correspond à la disponibilité dans le modèle de sécurité ?", options: ["Seules les personnes autorisées peuvent lire un dossier.", "Les services restent accessibles aux personnes autorisées lorsqu'ils sont nécessaires.", "Les changements de données peuvent être détectés."], correct: 1, explanation: "La disponibilité vise l'accès fiable aux ressources pour les utilisateurs autorisés." },
  ],
};

const labs = {
  sql: { title: "Auditer un filtre de recherche", scenario: "Un catalogue assemble le texte saisi dans sa requête SQL. Choisis le plan de correction le plus robuste.", options: ["Lier les valeurs, limiter les identifiants variables à une liste autorisée et réduire les droits du compte.", "Supprimer les apostrophes visibles puis conserver la concaténation.", "Afficher les erreurs SQL complètes pour guider les visiteurs."], correct: 0, explanation: "Les paramètres séparent données et syntaxe; les identifiants doivent être contrôlés séparément, avec des privilèges limités." },
  xss: { title: "Sécuriser un fil de commentaires", scenario: "Le produit veut afficher les commentaires comme du texte simple. Quel rendu choisis-tu ?", options: ["Insérer la chaîne avec innerHTML sans la contrôler.", "Utiliser une insertion textuelle comme textContent et tester chaque point de rendu.", "Désactiver la CSP et compter sur le navigateur."], correct: 1, explanation: "Une insertion textuelle évite l'interprétation HTML; chaque contexte de rendu reste à vérifier." },
  passwords: { title: "Examiner le stockage des comptes", scenario: "Tu relis la conception d'un espace membre. Quelle combinaison est la plus appropriée ?", options: ["Mots de passe en clair et lien de récupération permanent.", "Chiffrement réversible avec une clé inscrite dans le code.", "Hachage lent dédié avec sel unique, limitation des tentatives et récupération à jeton temporaire."], correct: 2, explanation: "Un hachage adapté, des contrôles de connexion et une récupération bornée couvrent plusieurs risques complémentaires." },
  network: { title: "Définir un périmètre de test", scenario: "Une adresse répond depuis Internet, mais aucun mandat n'a été donné. Quelle est la suite correcte ?", options: ["Ne pas sonder; demander une autorisation explicite définissant cible, méthode et période.", "Lancer un balayage rapide puisque le service est public.", "Essayer d'autres adresses proches pour trouver le propriétaire."], correct: 0, explanation: "Une réponse réseau n'est pas une autorisation. Le test doit rester dans un périmètre formellement approuvé." },
  linux: { title: "Vérifier une commande avant usage", scenario: "Un message propose une commande avec privilèges élevés pour nettoyer un dossier. Quelle action choisis-tu ?", options: ["L'exécuter immédiatement pour éviter de perdre du temps.", "Lire la documentation, inspecter les chemins et confirmer l'effet dans un environnement de test.", "La lancer depuis le répertoire racine pour tout nettoyer."], correct: 1, explanation: "La vérification des options, chemins et effets évite les changements involontaires; les exemples du cours ne sont pas exécutés." },
  security: { title: "Réagir à un incident simulé", scenario: "Une alerte suggère qu'un secret a été exposé. Quel ordre d'action est le plus sûr ?", options: ["Supprimer les journaux puis attendre.", "Publier le secret pour demander une identification.", "Alerter les responsables, suivre la procédure, préserver les éléments utiles et renouveler le secret exposé."], correct: 2, explanation: "La réponse coordonnée préserve les informations nécessaires et permet de révoquer le secret sans divulgation supplémentaire." },
};

const warmupChallenge = {
  id: "sql",
  topic: "WEB · INJECTION SQL",
  title: "Repérer le risque",
  prompt: "Une application construit une requête en insérant directement le nom fourni par une personne. Quel est le principal risque ?",
  code: `query = "SELECT * FROM users WHERE name = '" + input + "'"`,
  answers: [
    "La requête devrait toujours renvoyer plusieurs lignes.",
    "Une entrée inattendue peut modifier la structure de la requête.",
    "Le nom de table est trop court.",
  ],
  correct: "b",
  explanation: "Exact. Une entrée non fiable concaténée peut être interprétée comme une partie de la commande SQL. Les requêtes préparées séparent les données de l'instruction.",
};

function loadProgress() {
  const emptyProgress = () => {
    const completedLessons = {};
    const quizReview = {};
    const completedAt = {};
    modules.forEach((module) => {
      completedLessons[module.id] = [];
      quizReview[module.id] = [];
      completedAt[module.id] = null;
    });
    return {
      completedModules: [],
      challengeCompleted: false,
      points: 0,
      completedLessons,
      completedLabs: [],
      quizReview,
      lastLearning: null,
      completedAt,
      pathCompletedAt: null,
    };
  };
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return emptyProgress();

    const parsed = JSON.parse(saved);
    if (!parsed || !Number.isFinite(parsed.points)) {
      return emptyProgress();
    }

    const moduleIds = new Set(modules.map((module) => module.id));
    const validIds = (value) => Array.isArray(value)
      ? [...new Set(value.filter((id) => moduleIds.has(id)))]
      : [];
    const completedLessons = {};
    const completedAt = {};
    const quizReview = {};
    modules.forEach((module) => {
      const lessonIndexes = parsed.completedLessons?.[module.id];
      completedLessons[module.id] = Array.isArray(lessonIndexes)
        ? [...new Set(lessonIndexes.filter((index) => Number.isInteger(index) && index >= 0 && index < module.lessons.length))]
        : [];
      const completedDate = parsed.completedAt?.[module.id];
      if (typeof completedDate === "string" && !Number.isNaN(Date.parse(completedDate))) {
        completedAt[module.id] = completedDate;
      }
      const availableQuestionIds = new Set(
        [...module.quiz, ...advancedQuiz[module.id]].map((question, index) => (
          index < QUIZ_QUESTION_COUNT
            ? `${module.id}-base-${index}`
            : `${module.id}-advanced-${index - QUIZ_QUESTION_COUNT}`
        )),
      );
      const review = parsed.quizReview?.[module.id];
      quizReview[module.id] = Array.isArray(review)
        ? [...new Set(review.filter((id) => availableQuestionIds.has(id)))]
        : [];
    });
    const lastLearning = parsed.lastLearning;
    const validLastLearning = lastLearning
      && moduleIds.has(lastLearning.moduleId)
      && Number.isInteger(lastLearning.lessonIndex)
      && lastLearning.lessonIndex >= 0
      && lastLearning.lessonIndex < modules.find((module) => module.id === lastLearning.moduleId).lessons.length
      ? { moduleId: lastLearning.moduleId, lessonIndex: lastLearning.lessonIndex }
      : null;

    const challengeCompleted = typeof parsed.challengeCompleted === "boolean"
      ? parsed.challengeCompleted
      : Array.isArray(parsed.completed) && parsed.completed.includes(warmupChallenge.id);

    return {
      completedModules: validIds(parsed.completedModules),
      challengeCompleted,
      points: Math.max(0, Math.floor(parsed.points)),
      completedLessons,
      completedLabs: validIds(parsed.completedLabs),
      quizReview,
      lastLearning: validLastLearning,
      completedAt,
      pathCompletedAt: typeof parsed.pathCompletedAt === "string" && !Number.isNaN(Date.parse(parsed.pathCompletedAt))
        ? parsed.pathCompletedAt
        : null,
    };
  } catch (error) {
    console.error("Impossible de lire la progression CyberLab sauvegardée.", error);
    return emptyProgress();
  }
}

let progress = loadProgress();
let currentWarmup = warmupChallenge;
let currentModule = null;
let quizIndex = 0;
let quizCorrect = 0;
let quizAnswered = false;
let quizMode = "standard";
let currentQuizQuestions = [];
let quizMissedQuestionIds = [];
let activeLab = null;

const elements = {
  points: document.querySelector("#points-total"),
  completed: document.querySelector("#challenges-total"),
  journeyProgress: document.querySelector("#journey-progress"),
  journeyTrack: document.querySelector('[role="progressbar"]'),
  journeyLabel: document.querySelector("#journey-label"),
  challengeTopic: document.querySelector("#challenge-topic"),
  challengeTitle: document.querySelector("#challenge-title"),
  challengePrompt: document.querySelector("#challenge-prompt"),
  challengeCode: document.querySelector("#challenge-code code"),
  challengeNumber: document.querySelector(".challenge-number"),
  challengeComplete: document.querySelector("#challenge-complete"),
  feedback: document.querySelector("#challenge-feedback"),
  form: document.querySelector("#challenge-form"),
  submit: document.querySelector(".submit-answer"),
  dialog: document.querySelector("#course-dialog"),
  dialogKicker: document.querySelector("#course-dialog-kicker"),
  dialogTitle: document.querySelector("#course-dialog-title"),
  dialogBody: document.querySelector("#course-dialog-body"),
  resumeLearning: document.querySelector("#resume-learning"),
  resumeSummary: document.querySelector("#resume-learning-summary"),
  certificate: document.querySelector("#certificate-card"),
  certificateSkills: document.querySelector("#certificate-skills"),
  certificateDate: document.querySelector("#certificate-date"),
};

function saveProgress() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    return true;
  } catch (error) {
    console.error("Impossible d'enregistrer la progression CyberLab.", error);
    return false;
  }
}

function renderProgress() {
  const completedCount = progress.completedModules.length;
  const percent = (completedCount / modules.length) * 100;
  elements.points.textContent = String(progress.points);
  elements.completed.innerHTML = `${completedCount} <small>/ ${modules.length}</small>`;
  elements.journeyProgress.style.width = `${percent}%`;
  elements.journeyTrack.setAttribute("aria-valuenow", String(completedCount));
  elements.journeyLabel.textContent = `${completedCount} sur ${modules.length} cours terminés`;
  elements.challengeComplete.textContent = progress.challengeCompleted ? "Bonus obtenu" : "Bonus disponible";
  elements.certificate.hidden = completedCount !== modules.length;
  if (completedCount === modules.length) renderCertificate();

  modules.forEach((module) => {
    const isComplete = progress.completedModules.includes(module.id);
    const doneLessons = progress.completedLessons[module.id]?.length ?? 0;
    document.querySelectorAll(`[data-course-link="${module.id}"]`).forEach((link) => {
      const card = link.closest(".course-card");
      if (!card) return;
      card.classList.toggle("is-complete", isComplete);
      let status = card.querySelector(".course-progress-label");
      if (!status) {
        status = document.createElement("div");
        status.className = "course-progress-label";
        card.querySelector("h3").insertAdjacentElement("afterend", status);
      }
      status.textContent = isComplete
        ? "Module validé · bilan enregistré"
        : `${doneLessons}/${module.lessons.length} leçon${doneLessons === 1 ? "" : "s"} étudiée${doneLessons === 1 ? "" : "s"} · labo + quiz`;
      link.innerHTML = isComplete ? "Réviser le module <span>↗</span>" : "Ouvrir le module <span>→</span>";
    });
  });

  const next = getResumePoint();
  const resumeModule = modules.find((module) => module.id === next.moduleId);
  const lessonTitle = resumeModule?.lessons[next.lessonIndex]?.heading;
  elements.resumeLearning.textContent = completedCount === modules.length
    ? "Revoir le parcours →"
    : next.hasProgress
      ? `Reprendre ${resumeModule.title} · ${next.lessonIndex + 1}/${resumeModule.lessons.length} →`
      : `Commencer ${lessonTitle} →`;
  elements.resumeSummary.textContent = `${next.completedLessonCount} leçons étudiées · ${progress.completedLabs.length} laboratoires terminés`;
}

function getResumePoint() {
  if (progress.lastLearning) {
    return {
      ...progress.lastLearning,
      hasProgress: true,
      completedLessonCount: Object.values(progress.completedLessons).reduce((total, lessons) => total + lessons.length, 0),
    };
  }
  const module = modules.find((item) => !progress.completedModules.includes(item.id)) || modules[0];
  return {
    moduleId: module.id,
    lessonIndex: 0,
    hasProgress: false,
    completedLessonCount: Object.values(progress.completedLessons).reduce((total, lessons) => total + lessons.length, 0),
  };
}

function renderCertificate() {
  elements.certificateSkills.replaceChildren();
  modules.forEach((module) => {
    const item = document.createElement("li");
    item.textContent = `${module.title} — ${module.objectives[0]}`;
    elements.certificateSkills.append(item);
  });
  const date = progress.pathCompletedAt ? new Date(progress.pathCompletedAt) : new Date();
  elements.certificateDate.textContent = `Parcours terminé le ${new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(date)} · ${progress.points} XP`;
}

function areModuleLessonsComplete(module) {
  const completed = progress.completedLessons[module.id] ?? [];
  return module.lessons.every((_, index) => completed.includes(index));
}

function appendTextElement(parent, tag, text, className) {
  const element = document.createElement(tag);
  element.textContent = text;
  if (className) element.className = className;
  parent.append(element);
  return element;
}

function makeButton(label, className, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `button ${className}`;
  button.textContent = label;
  button.addEventListener("click", onClick);
  return button;
}

function openModule(moduleId, lessonIndex = 0) {
  currentModule = modules.find((item) => item.id === moduleId);
  if (!currentModule) return;

  const safeLessonIndex = Math.min(Math.max(lessonIndex, 0), currentModule.lessons.length - 1);
  progress.lastLearning = { moduleId, lessonIndex: safeLessonIndex };
  saveProgress();
  elements.dialogKicker.textContent = `MODULE ${currentModule.number} · ${currentModule.category}`;
  elements.dialogTitle.textContent = currentModule.title;
  renderLesson();
  elements.dialog.showModal();
  elements.dialogBody.scrollTop = 0;
  const resumeCard = elements.dialogBody.querySelector(`[data-lesson-index="${safeLessonIndex}"]`);
  if (resumeCard) {
    elements.dialogBody.scrollTop = resumeCard.getBoundingClientRect().top
      - elements.dialogBody.getBoundingClientRect().top
      + elements.dialogBody.scrollTop
      - 12;
  }
  renderProgress();
}

function renderLesson() {
  elements.dialogBody.replaceChildren();
  appendTextElement(elements.dialogBody, "p", currentModule.description, "course-intro");

  appendTextElement(elements.dialogBody, "h3", "À la fin de ce module, tu sauras…", "course-subheading");
  const objectiveList = document.createElement("ul");
  objectiveList.className = "objective-list";
  currentModule.objectives.forEach((objective) => {
    const item = document.createElement("li");
    appendTextElement(item, "span", "✓", "objective-check");
    appendTextElement(item, "span", objective);
    objectiveList.append(item);
  });
  elements.dialogBody.append(objectiveList);

  appendTextElement(elements.dialogBody, "h3", "Le cours", "course-subheading lesson-section-title");
  const lessonList = document.createElement("ol");
  lessonList.className = "lesson-list";
  currentModule.lessons.forEach((lesson, index) => {
    const card = document.createElement("li");
    card.className = "lesson-card";
    card.dataset.lessonIndex = String(index);
    const heading = document.createElement("div");
    heading.className = "lesson-card-heading";
    appendTextElement(heading, "span", String(lessonList.children.length + 1).padStart(2, "0"), "lesson-number");
    appendTextElement(heading, "h3", lesson.heading);
    card.append(heading);
    lesson.paragraphs.forEach((paragraph) => appendTextElement(card, "p", paragraph));
    if (lesson.example) appendTextElement(card, "code", lesson.example, "lesson-example");
    const completed = progress.completedLessons[currentModule.id].includes(index);
    const completionButton = makeButton(
      completed ? "Leçon étudiée ✓" : "Marquer comme étudiée",
      completed ? "button-secondary lesson-complete is-complete" : "button-secondary lesson-complete",
      () => markLessonComplete(index),
    );
    completionButton.disabled = completed;
    card.append(completionButton);
    lessonList.append(card);
  });
  elements.dialogBody.append(lessonList);

  const practice = document.createElement("section");
  practice.className = "practice-card";
  appendTextElement(practice, "p", "APPLICATION GUIDÉE", "practice-kicker");
  appendTextElement(practice, "h3", currentModule.practice.heading);
  currentModule.practice.paragraphs.forEach((paragraph, index) => {
    const step = document.createElement("div");
    step.className = "practice-step";
    appendTextElement(step, "span", String(index + 1).padStart(2, "0"), "practice-step-number");
    appendTextElement(step, "p", paragraph);
    practice.append(step);
  });
  elements.dialogBody.append(practice);

  const lab = labs[currentModule.id];
  const labSection = document.createElement("section");
  labSection.className = "interactive-lab";
  appendTextElement(labSection, "p", "LABORATOIRE SIMULÉ · 100 % LOCAL", "practice-kicker");
  appendTextElement(labSection, "h3", lab.title);
  appendTextElement(labSection, "p", lab.scenario, "lab-scenario");
  if (progress.completedLabs.includes(currentModule.id)) {
    appendTextElement(labSection, "p", "Laboratoire déjà terminé · +25 XP obtenus", "lab-complete-note");
  }
  labSection.append(makeButton(
    progress.completedLabs.includes(currentModule.id) ? "Refaire le laboratoire" : "Lancer le laboratoire",
    "button-primary lab-start",
    () => renderLab(),
  ));
  elements.dialogBody.append(labSection);

  const tip = document.createElement("div");
  const recap = document.createElement("section");
  recap.className = "recap-card";
  appendTextElement(recap, "p", "RÉVISION ACTIVE", "practice-kicker");
  appendTextElement(recap, "h3", "Avant le quiz, vérifie que tu peux…");
  const recapList = document.createElement("ul");
  currentModule.objectives.forEach((objective) => {
    const item = document.createElement("li");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.setAttribute("aria-label", objective);
    appendTextElement(item, "span", objective);
    item.prepend(checkbox);
    recapList.append(item);
  });
  recap.append(recapList);
  elements.dialogBody.append(recap);

  tip.className = "lesson-tip";
  tip.textContent = `À retenir : le quiz Découverte comporte 5 questions, le quiz Approfondi en comporte 10; il faut obtenir au moins 80 % pour valider le module.`;
  elements.dialogBody.append(tip);

  const modes = document.createElement("div");
  modes.className = "quiz-mode-panel";
  appendTextElement(modes, "p", "CHOISIS TON NIVEAU", "practice-kicker");
  const lessonsComplete = areModuleLessonsComplete(currentModule);
  const quizGate = appendTextElement(
    modes,
    "p",
    lessonsComplete
      ? "Toutes les leçons sont étudiées. Le quiz est déverrouillé."
      : `Étudie et marque comme lues les ${currentModule.lessons.length} leçons pour déverrouiller le quiz (${progress.completedLessons[currentModule.id].length}/${currentModule.lessons.length}).`,
    lessonsComplete ? "quiz-gate is-unlocked" : "quiz-gate",
  );
  quizGate.id = "quiz-gate-message";
  const modeOptions = document.createElement("div");
  modeOptions.className = "quiz-mode-options";
  const reviewAvailable = progress.quizReview[currentModule.id].length > 0;
  const quizModes = [
    { id: "standard", label: "Découverte · 5 questions" },
    { id: "advanced", label: "Approfondi · 10 questions" },
    ...(reviewAvailable ? [{ id: "review", label: `Révision ciblée · ${progress.quizReview[currentModule.id].length}` }] : []),
  ];
  if (!quizModes.some((mode) => mode.id === quizMode)) quizMode = "standard";
  quizModes.forEach((mode) => {
    const button = makeButton(mode.label, `button-secondary quiz-mode-button${mode.id === quizMode ? " is-selected" : ""}`, () => {
      quizMode = mode.id;
      modeOptions.querySelectorAll(".quiz-mode-button").forEach((option) => {
        const isSelected = option === button;
        option.classList.toggle("is-selected", isSelected);
        option.setAttribute("aria-pressed", String(isSelected));
      });
    });
    button.dataset.quizMode = mode.id;
    button.setAttribute("aria-pressed", String(mode.id === quizMode));
    button.disabled = !lessonsComplete;
    modeOptions.append(button);
  });
  modes.append(modeOptions);
  elements.dialogBody.append(modes);

  const actions = document.createElement("div");
  actions.className = "lesson-actions";
  appendTextElement(actions, "span", `${currentModule.lessons.length} leçons · validation à 80 %`);
  const startQuizButton = makeButton(
    "Commencer le quiz →",
    "button-primary lesson-start-quiz",
    () => startQuiz(quizMode),
  );
  startQuizButton.disabled = !lessonsComplete;
  startQuizButton.setAttribute("aria-describedby", "quiz-gate-message");
  actions.append(startQuizButton);
  elements.dialogBody.append(actions);
}

function saveResumePoint(moduleId, lessonIndex) {
  progress.lastLearning = { moduleId, lessonIndex };
  if (!saveProgress()) return false;
  renderProgress();
  return true;
}

function markLessonComplete(lessonIndex) {
  const completed = progress.completedLessons[currentModule.id];
  if (!completed.includes(lessonIndex)) completed.push(lessonIndex);
  completed.sort((a, b) => a - b);

  let nextModule = currentModule;
  let nextLessonIndex = currentModule.lessons.findIndex((_, index) => !completed.includes(index));
  if (nextLessonIndex === -1) {
    const followingModule = modules.slice(modules.indexOf(currentModule) + 1)
      .find((module) => !progress.completedModules.includes(module.id));
    if (followingModule) {
      nextModule = followingModule;
      nextLessonIndex = followingModule.lessons.findIndex((_, index) => (
        !progress.completedLessons[followingModule.id].includes(index)
      ));
      if (nextLessonIndex === -1) nextLessonIndex = 0;
    } else {
      nextLessonIndex = lessonIndex;
    }
  }

  saveResumePoint(nextModule.id, nextLessonIndex);
  renderLesson();
}

function startQuiz(mode = "standard") {
  if (!currentModule || !areModuleLessonsComplete(currentModule)) {
    renderLesson();
    return;
  }
  if (mode === "review" && progress.quizReview[currentModule.id].length === 0) {
    quizMode = "standard";
    renderLesson();
    return;
  }

  quizMode = mode;
  const questions = currentModule.quiz.map((question, index) => ({
    ...question,
    id: `${currentModule.id}-base-${index}`,
  }));
  const advancedQuestions = advancedQuiz[currentModule.id].map((question, index) => ({
    ...question,
    id: `${currentModule.id}-advanced-${index}`,
  }));
  currentQuizQuestions = mode === "advanced"
    ? [...questions, ...advancedQuestions]
    : mode === "review"
      ? [...questions, ...advancedQuestions].filter((question) => progress.quizReview[currentModule.id].includes(question.id))
      : questions;
  if (currentQuizQuestions.length === 0) {
    quizMode = "standard";
    renderLesson();
    return;
  }
  quizIndex = 0;
  quizCorrect = 0;
  quizAnswered = false;
  quizMissedQuestionIds = [];
  renderQuestion();
}

function renderQuestion() {
  elements.dialogBody.replaceChildren();
  const question = currentQuizQuestions[quizIndex];
  const questionCount = currentQuizQuestions.length;

  const progressRow = document.createElement("div");
  progressRow.className = "quiz-progress";
  appendTextElement(progressRow, "span", `Question ${quizIndex + 1} sur ${questionCount}`);
  appendTextElement(progressRow, "strong", `${quizCorrect} bonne${quizCorrect === 1 ? "" : "s"} réponse${quizCorrect === 1 ? "" : "s"}`);
  elements.dialogBody.append(progressRow);

  const meter = document.createElement("div");
  meter.className = "progress-track quiz-track";
  meter.setAttribute("role", "progressbar");
  meter.setAttribute("aria-label", `Question ${quizIndex + 1} sur ${questionCount}`);
  meter.setAttribute("aria-valuemin", "0");
  meter.setAttribute("aria-valuemax", String(questionCount));
  meter.setAttribute("aria-valuenow", String(quizIndex + 1));
  const meterFill = document.createElement("span");
  meterFill.style.width = `${((quizIndex + 1) / questionCount) * 100}%`;
  meter.append(meterFill);
  elements.dialogBody.append(meter);

  appendTextElement(elements.dialogBody, "h3", question.question, "quiz-question");
  const form = document.createElement("form");
  const fieldset = document.createElement("fieldset");
  fieldset.className = "quiz-options";
  const legend = document.createElement("legend");
  legend.className = "sr-only";
  legend.textContent = "Choisis une réponse";
  fieldset.append(legend);

  question.options.forEach((option, index) => {
    const label = document.createElement("label");
    label.className = "quiz-option";
    const input = document.createElement("input");
    input.type = "radio";
    input.name = "quiz-answer";
    input.value = String(index);
    label.append(input);
    appendTextElement(label, "span", option);
    fieldset.append(label);
  });
  form.append(fieldset);

  const feedback = document.createElement("div");
  feedback.className = "quiz-feedback";
  feedback.setAttribute("role", "status");
  feedback.setAttribute("aria-live", "polite");
  feedback.hidden = true;
  form.append(feedback);

  fieldset.addEventListener("change", () => {
    if (feedback.hidden || quizAnswered) return;
    feedback.hidden = true;
    feedback.classList.remove("is-wrong");
  });

  const actions = document.createElement("div");
  actions.className = "quiz-actions";
  actions.append(makeButton("Quitter le quiz", "button-secondary", renderLesson));
  const next = makeButton(
    "Vérifier ma réponse →",
    "button-primary",
    () => {
      if (!quizAnswered) {
        const selected = form.querySelector('input[name="quiz-answer"]:checked');
        if (!selected) {
          feedback.textContent = "Sélectionne une réponse avant de continuer.";
          feedback.classList.add("is-wrong");
          feedback.hidden = false;
          return;
        }

        quizAnswered = true;
        const correct = Number(selected.value) === question.correct;
        if (correct) quizCorrect += 1;
        else quizMissedQuestionIds.push(question.id);
        feedback.textContent = `${correct ? "Bonne réponse. " : "Pas tout à fait. "}${question.explanation}`;
        feedback.classList.remove("is-wrong");
        feedback.hidden = false;
        form.querySelectorAll('input[name="quiz-answer"]').forEach((input) => {
          input.disabled = true;
        });
        next.textContent = quizIndex === questionCount - 1 ? "Voir mon résultat →" : "Question suivante →";
        return;
      }
      if (quizIndex === questionCount - 1) {
        renderQuizResult();
        return;
      }
      quizIndex += 1;
      quizAnswered = false;
      renderQuestion();
    },
  );
  actions.append(next);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    next.click();
  });
  form.append(actions);
  elements.dialogBody.append(form);
  elements.dialogBody.scrollTop = 0;
  elements.dialogBody.querySelector('input[name="quiz-answer"]')?.focus({ preventScroll: true });
}

function renderLab() {
  activeLab = labs[currentModule.id];
  elements.dialogBody.replaceChildren();
  const lab = document.createElement("section");
  lab.className = "interactive-lab lab-workspace";
  appendTextElement(lab, "p", "LABORATOIRE SIMULÉ · AUCUNE COMMANDE EXÉCUTÉE", "practice-kicker");
  appendTextElement(lab, "h3", activeLab.title);
  appendTextElement(lab, "p", activeLab.scenario, "lab-scenario");
  const form = document.createElement("form");
  const options = document.createElement("fieldset");
  options.className = "quiz-options";
  appendTextElement(options, "legend", "Choisis la meilleure décision", "sr-only");
  activeLab.options.forEach((option, index) => {
    const label = document.createElement("label");
    label.className = "quiz-option";
    const input = document.createElement("input");
    input.type = "radio";
    input.name = "lab-choice";
    input.value = String(index);
    label.append(input);
    appendTextElement(label, "span", option);
    options.append(label);
  });
  form.append(options);
  const feedback = appendTextElement(form, "div", "", "quiz-feedback");
  feedback.setAttribute("role", "status");
  feedback.setAttribute("aria-live", "polite");
  feedback.hidden = true;
  const actions = document.createElement("div");
  actions.className = "quiz-actions";
  actions.append(makeButton("Retour au cours", "button-secondary", renderLesson));
  actions.append(makeButton("Vérifier ma décision →", "button-primary lab-submit", () => {
    const selected = form.querySelector('input[name="lab-choice"]:checked');
    if (!selected) {
      feedback.textContent = "Sélectionne une décision avant de continuer.";
      feedback.classList.add("is-wrong");
      feedback.hidden = false;
      return;
    }
    if (Number(selected.value) !== activeLab.correct) {
      feedback.textContent = `Pas tout à fait. ${activeLab.explanation}`;
      feedback.classList.add("is-wrong");
      feedback.hidden = false;
      return;
    }

    feedback.textContent = `Bonne décision. ${activeLab.explanation}`;
    feedback.classList.remove("is-wrong");
    feedback.hidden = false;
    form.querySelectorAll('input[name="lab-choice"]').forEach((input) => {
      input.disabled = true;
    });
    const alreadyCompleted = progress.completedLabs.includes(currentModule.id);
    if (!alreadyCompleted) {
      progress.completedLabs.push(currentModule.id);
      progress.points += 25;
      if (!saveProgress()) feedback.textContent += " La progression n'a pas pu être sauvegardée dans ce navigateur.";
      renderProgress();
    }
    actions.querySelector(".lab-submit").disabled = true;
    actions.querySelector(".lab-submit").textContent = alreadyCompleted ? "Laboratoire terminé ✓" : "+25 XP · laboratoire terminé ✓";
  }));
  form.append(actions);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    actions.querySelector(".lab-submit").click();
  });
  lab.append(form);
  elements.dialogBody.append(lab);
  elements.dialogBody.scrollTop = 0;
  elements.dialogBody.querySelector('input[name="lab-choice"]')?.focus({ preventScroll: true });
}

function renderQuizResult() {
  const questionCount = currentQuizQuestions.length;
  const requiredScore = Math.ceil(questionCount * 0.8);
  const passed = quizCorrect >= requiredScore;
  const wasComplete = progress.completedModules.includes(currentModule.id);
  progress.quizReview[currentModule.id] = [...new Set(quizMissedQuestionIds)];
  if (passed && !wasComplete) {
    progress.completedModules.push(currentModule.id);
    progress.completedAt[currentModule.id] = new Date().toISOString();
    progress.points += QUIZ_REWARD;
    const nextModule = modules.find((module) => !progress.completedModules.includes(module.id));
    if (nextModule) {
      const nextLessonIndex = nextModule.lessons.findIndex((_, index) => (
        !progress.completedLessons[nextModule.id].includes(index)
      ));
      progress.lastLearning = {
        moduleId: nextModule.id,
        lessonIndex: nextLessonIndex === -1 ? 0 : nextLessonIndex,
      };
    }
    if (progress.completedModules.length === modules.length) {
      progress.pathCompletedAt = new Date().toISOString();
    }
  }
  const saved = saveProgress();
  renderProgress();

  const result = document.createElement("section");
  result.className = `quiz-result${passed ? "" : " is-failed"}`;
  result.setAttribute("aria-live", "polite");
  appendTextElement(result, "p", `${quizCorrect}/${questionCount}`, "quiz-result-score");
  appendTextElement(result, "h3", passed ? "Module réussi !" : "Continue tes révisions");
  appendTextElement(
    result,
    "p",
    passed
      ? wasComplete
        ? "Tu as validé ce module auparavant. Tu peux relire le cours ou retenter le quiz pour t'entraîner."
      : `Tu as atteint le seuil requis de ${requiredScore}/${questionCount}.`
      : `Il faut au moins ${requiredScore}/${questionCount} bonnes réponses. Relis les leçons ou révise les notions manquées, puis retente le quiz.`,
  );

  if (passed && !wasComplete) {
    const note = appendTextElement(
      result,
      "div",
      `+${QUIZ_REWARD} XP · progression ${progress.completedModules.length}/${modules.length}`,
      "module-complete-note",
    );
    if (!saved) note.textContent += " · progression non sauvegardée dans ce navigateur.";
  } else if (!saved) {
    appendTextElement(result, "p", "La progression n'a pas pu être sauvegardée dans ce navigateur.", "module-complete-note");
  }

  if (quizMissedQuestionIds.length > 0) {
    result.append(makeButton(
      `Réviser les ${quizMissedQuestionIds.length} notion${quizMissedQuestionIds.length === 1 ? "" : "s"} manquée${quizMissedQuestionIds.length === 1 ? "" : "s"}`,
      "button-secondary targeted-review",
      () => startQuiz("review"),
    ));
  }

  const actions = document.createElement("div");
  actions.className = "quiz-actions";
  actions.append(makeButton("Revoir les leçons", "button-secondary", renderLesson));
  actions.append(makeButton(
    passed ? "Terminer" : "Réessayer le quiz",
    "button-primary",
    () => {
      if (passed) elements.dialog.close();
      else startQuiz();
    },
  ));
  result.append(actions);
  elements.dialogBody.replaceChildren(result);
  elements.dialogBody.scrollTop = 0;
}

function renderWarmup(challenge) {
  currentWarmup = challenge;
  elements.challengeTopic.textContent = challenge.topic;
  elements.challengeTitle.textContent = challenge.title;
  elements.challengePrompt.textContent = challenge.prompt;
  elements.challengeCode.textContent = challenge.code;
  elements.feedback.hidden = true;
  elements.feedback.classList.remove("is-wrong");
  elements.form.reset();
  elements.form.querySelectorAll('input[name="answer"]').forEach((input) => {
    input.disabled = progress.challengeCompleted;
  });
  elements.submit.disabled = progress.challengeCompleted;
  elements.submit.textContent = progress.challengeCompleted ? "Bonus déjà obtenu ✓" : "Vérifier ma réponse →";
  elements.challengeComplete.textContent = progress.challengeCompleted ? "Bonus obtenu" : "Bonus disponible";
}

elements.form.addEventListener("submit", (event) => {
  event.preventDefault();
  const selected = new FormData(elements.form).get("answer");
  if (typeof selected !== "string") {
    elements.feedback.textContent = "Choisis une réponse avant de vérifier.";
    elements.feedback.classList.add("is-wrong");
    elements.feedback.hidden = false;
    return;
  }

  if (selected !== currentWarmup.correct) {
    elements.feedback.textContent = "Pas tout à fait. Relis l'énoncé et essaie une autre réponse.";
    elements.feedback.classList.add("is-wrong");
    elements.feedback.hidden = false;
    return;
  }

  elements.feedback.textContent = currentWarmup.explanation;
  elements.feedback.classList.remove("is-wrong");
  elements.feedback.hidden = false;
  if (!progress.challengeCompleted) {
    progress.challengeCompleted = true;
    progress.points += CHALLENGE_REWARD;
    const saved = saveProgress();
    renderProgress();
    if (!saved) elements.feedback.textContent += " La progression n'a pas pu être sauvegardée dans ce navigateur.";
  }
  elements.form.querySelectorAll('input[name="answer"]').forEach((input) => {
    input.disabled = true;
  });
  elements.submit.disabled = true;
  elements.submit.textContent = "Bonus obtenu ✓";
});

document.querySelectorAll("[data-course-link]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    openModule(link.dataset.courseLink);
  });
});

elements.resumeLearning.addEventListener("click", () => {
  const point = getResumePoint();
  openModule(point.moduleId, point.lessonIndex);
});
document.querySelector("#print-certificate").addEventListener("click", () => window.print());

document.querySelectorAll("[data-nav]").forEach((link) => {
  link.addEventListener("click", closeSidebar);
});

const sidebar = document.querySelector(".sidebar");
const mobileMenu = document.querySelector(".mobile-menu");
const sidebarBackdrop = document.querySelector(".sidebar-backdrop");

function closeSidebar() {
  sidebar.classList.remove("is-open");
  sidebarBackdrop.hidden = true;
  mobileMenu.setAttribute("aria-expanded", "false");
}

function syncPage() {
  const route = window.location.hash.slice(1);
  const isCatalog = route === "cours" || route === "parcours";
  document.querySelector("#dashboard-page").hidden = isCatalog;
  document.querySelector("#catalog-page").hidden = !isCatalog;

  const activeNav = isCatalog ? "cours" : route === "progression" ? "progression" : "accueil";
  document.querySelectorAll(".nav-link").forEach((item) => {
    item.classList.toggle("active", item.dataset.nav === activeNav);
  });

  const labels = { accueil: "Vue d'ensemble", cours: "Catalogue des cours", progression: "Ma progression" };
  document.querySelector("#current-section").textContent = labels[activeNav];
}

mobileMenu.addEventListener("click", () => {
  const isOpen = sidebar.classList.toggle("is-open");
  sidebarBackdrop.hidden = !isOpen;
  mobileMenu.setAttribute("aria-expanded", String(isOpen));
});
document.querySelector(".sidebar-close").addEventListener("click", closeSidebar);
sidebarBackdrop.addEventListener("click", closeSidebar);
window.addEventListener("hashchange", syncPage);
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeSidebar();
});
document.querySelector(".dialog-close").addEventListener("click", () => elements.dialog.close());
elements.dialog.addEventListener("click", (event) => {
  if (event.target === elements.dialog) elements.dialog.close();
});

let activeCourseFilter = "all";
const courseSearch = document.querySelector("#course-search");
const courseCards = [...document.querySelectorAll(".catalog-course-grid .course-card")];
const courseResultCount = document.querySelector("#catalog-result-count");
const courseEmptyState = document.querySelector("#catalog-empty");

function filterCourses() {
  const query = courseSearch.value.trim().toLocaleLowerCase("fr");
  let visibleCount = 0;
  courseCards.forEach((card) => {
    const matchesCategory = activeCourseFilter === "all" || card.dataset.courseCategory === activeCourseFilter;
    const matchesSearch = !query || card.textContent.toLocaleLowerCase("fr").includes(query);
    const isVisible = matchesCategory && matchesSearch;
    card.hidden = !isVisible;
    if (isVisible) visibleCount += 1;
  });
  courseResultCount.textContent = `${visibleCount} cours disponible${visibleCount === 1 ? "" : "s"}`;
  courseEmptyState.hidden = visibleCount !== 0;
}

document.querySelectorAll("[data-course-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    activeCourseFilter = button.dataset.courseFilter;
    document.querySelectorAll("[data-course-filter]").forEach((filter) => {
      const isActive = filter === button;
      filter.classList.toggle("is-active", isActive);
      filter.setAttribute("aria-pressed", String(isActive));
    });
    filterCourses();
  });
});
courseSearch.addEventListener("input", filterCourses);

renderProgress();
renderWarmup(warmupChallenge);
syncPage();
