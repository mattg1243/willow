
            /// Returns the `rustc` SemVer version and additional metadata
            /// like the git short hash and build date.
            pub fn version_meta() -> VersionMeta {
                VersionMeta {
                    semver: Version {
                        major: 1,
                        minor: 60,
                        patch: 0,
                        pre: vec![],
                        build: vec![],
                    },
                    host: "x86_64-apple-darwin".to_owned(),
                    short_version_string: "rustc 1.60.0 (7737e0b5c 2022-04-04)".to_owned(),
                    commit_hash: Some("7737e0b5c4103216d6fd8cf941b7ab9bdbaace7c".to_owned()),
                    commit_date: Some("2022-04-04".to_owned()),
                    build_date: None,
                    channel: Channel::Stable,
                }
            }
            