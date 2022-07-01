/// Create an incremental backup of our MonoDB Atlas cluster.
pub async fn backup_remote() {
    use mongodb::{bson::doc, options::ClientOptions, Client};

    pretty_env_logger::try_init().ok();
    dotenv::dotenv().ok();

    let backup_path = format!("-o {}-BACKUP", chrono::Utc::now());
    // Parse connection string into an options struct
    let mut client_opts = ClientOptions::parse(dotenv::var("DB_URL").unwrap())
        .await
        .unwrap();

    // Get a handle to the cluster
    let client = Client::with_options(client_opts).unwrap();

    // Ping the server
    client
        .database("name")
        .run_command(doc! { "ping": 1 }, None)
        .await
        .unwrap();

    // List the names of the database
    for db_name in client.list_database_names(None, None).await.unwrap() {
        log::info!("{}", db_name);
    }
    for collection in client
        .database("maindb")
        .list_collection_names(None)
        .await
        .unwrap()
    {
        log::info!("{}", collection);
    }

    use std::process::Command;
    Command::new("mongodump")
        .args([
            "--uri",
            dotenv::var("DB_URL").unwrap().as_str(),
            "--gzip",
            "-o dump",
        ])
        .output()
        .expect("failed to execute mongodump");
}

#[cfg(test)]
mod mongo_cd {
    use super::*;

    #[tokio::test]
    async fn backup_rem() {
        backup_remote().await;
    }
}
