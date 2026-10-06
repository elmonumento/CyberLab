# CyberLab

Prototype éducatif autonome pour apprendre les fondamentaux de la cybersécurité grâce à six cours, des laboratoires simulés, des quiz adaptables et un bilan de fin de parcours.

## Démarrer

Ouvre `index.html` dans un navigateur. Aucun compte, serveur, base de données ou accès réseau n'est nécessaire pour faire les exercices.

Pour lancer une prévisualisation locale avec Node.js :

```powershell
node server.js
```

Puis visite `http://localhost:4173`. Pour arrêter le serveur, retourne dans son terminal et utilise `Ctrl+C`.
Si le port `4173` est déjà utilisé, démarre le serveur avec `$env:PORT=4174; node server.js` puis ouvre `http://localhost:4174`.

## Contenu

- Six thèmes de découverte : injection SQL, XSS, mots de passe, notions réseau, commandes Linux et réflexes de sécurité.
- Chaque cours comprend des objectifs, trois leçons, des exemples sûrs, une mise en situation et un laboratoire interactif local.
- Le quiz reste verrouillé jusqu'à ce que chaque leçon du module soit marquée comme étudiée; les validations, laboratoires et le dernier point de reprise sont conservés localement.
- Chaque module propose un quiz Découverte de cinq questions ou un quiz Approfondi de dix questions. Le seuil de réussite est de 80 %, avec explication des réponses.
- Après un quiz, un mode de révision ciblée peut reprendre les questions manquées lors de la dernière tentative.
- Un cours réussi rapporte 100 XP une seule fois; terminer un laboratoire rapporte 25 XP et le challenge d'échauffement 10 XP.
- La réussite des six cours génère un bilan des compétences imprimable ou enregistrable en PDF. Il s'agit d'une attestation pédagogique locale, pas d'un diplôme professionnel.
- Les points, le score, les réponses à réviser et les modules terminés sont enregistrés dans le stockage local du navigateur.
- La progression peut être réinitialisée en effaçant les données locales du site dans les réglages du navigateur.
- L'accueil présente le résumé et le challenge; le catalogue des cours est accessible séparément avec recherche et filtres thématiques.
- Une checklist de révision active aide à se préparer au quiz; le menu mobile dispose d'un bouton de fermeture et d'un voile cliquable.
- Interface responsive avec navigation adaptée aux petits écrans.
- Le logo fourni est utilisé tel quel dans la navigation; le favicon SVG reprend son emblème orange et bleu nuit avec une URL versionnée.

## Périmètre de sécurité

Les exercices sont des simulations pédagogiques locales. Le prototype ne sonde aucun hôte, n'exécute pas de commandes système et ne traite pas de vrais identifiants. Les adresses réseau citées dans les exemples sont réservées à la documentation.

Le stockage local est un choix de prototype : la progression n'est pas synchronisée entre navigateurs ou appareils.
