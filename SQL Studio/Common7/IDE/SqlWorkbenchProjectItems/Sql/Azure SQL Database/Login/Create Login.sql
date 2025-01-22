-- =============================================================================================================================
-- Create SQL Login template for Azure SQL Database, Azure Synapse Analytics Database, and Azure Synapse SQL Analytics on-demand
-- =============================================================================================================================

CREATE LOGIN <SQL_login_name, sysname, login_name> 
	WITH PASSWORD = '<password, sysname, Change_Password>' 
GO

-- =============================================================================================================================
-- Create Microsoft Entra Login template for Azure SQL Database, Azure Synapse Analytics Database, and Azure Synapse SQL Analytics on-demand
-- =============================================================================================================================

-- CREATE LOGIN <Microsoft Entra Principal, sysname, login_name> FROM EXTERNAL PROVIDER