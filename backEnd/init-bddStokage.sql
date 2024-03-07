-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:8889
-- Généré le : mar. 27 fév. 2024 à 18:11
-- Version du serveur : 5.7.39
-- Version de PHP : 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `bddStokage`
--

-- --------------------------------------------------------

--
-- Structure de la table `bddInfo`
--

CREATE TABLE `bddInfo` (
  `id` int(255) NOT NULL,
  `UserId` int(255) NOT NULL,
  `Username` text NOT NULL,
  `Password` text NOT NULL,
  `DatabaseName` text NOT NULL,
  `Port` int(11) NOT NULL,
  `Host` text NOT NULL,
  `Type` text NOT NULL,
  `ContainerId` text NOT NULL,
  `Name` text NOT NULL,
  `Create_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `VersionBdd` varchar(255) NOT NULL,
  `Address` text NOT NULL,
  `HashAdress` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `bddInfo`
--


-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `mail` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `users`
--
--
-- Index pour les tables déchargées
--

--
-- Index pour la table `bddInfo`
--
ALTER TABLE `bddInfo`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`UserId`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `mail` (`mail`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `bddInfo`
--
ALTER TABLE `bddInfo`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=83;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `bddInfo`
--
ALTER TABLE `bddInfo`
  ADD CONSTRAINT `bddInfo_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
