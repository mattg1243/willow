
            /// Returns the `rustc` SemVer version and additional metadata
            /// like the git short hash and build date.
            pub fn version_meta() -> VersionMeta {
                VersionMeta {
                    semver: Version {
                        major: 1,
                        minor: 62,
                        patch: 0,
                        pre: vec![semver::Identifier::AlphaNumeric("nightly".to_owned()), ],
                        build: vec![],
                    },
                    host: "x86_64-apple-darwin".to_owned(),
                    short_version_string: "rustc 1.62.0-nightly (e745b4ddb 2022-04-07)".to_owned(),
                    commit_hash: Some("e745b4ddbd05026c75aae4506aef39fdfe1603c5".to_owned()),
                    commit_date: Some("2022-04-07".to_owned()),
                    build_date: None,
                    channel: Channel::Nightly,
                }
            }
            