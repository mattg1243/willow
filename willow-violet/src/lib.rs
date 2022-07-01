//! `willow-violet` contains a suite of CI/CD scripts, benches, and tests
//! for the Willow project.

#![warn(missing_docs)]

/// Contains a suite of CI/CD scripts.
pub mod harness;

#[cfg(test)]
mod tests {
    #[test]
    fn it_works() {
        let result = 2 + 2;
        assert_eq!(result, 4);
    }
}
