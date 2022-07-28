#![feature(test)]
#![allow(soft_unstable)]

extern crate violetj2p;
extern crate test;

use std::time::{Duration, Instant};
use test::Bencher;
use violetj2p::model::{header::WillowHeader, Header};

#[bench]
fn bench_full_header(b: &mut Bencher) {
    pretty_env_logger::try_init().ok();

    let start = Instant::now();
    let new_header = WillowHeader::new(
        "Anne Proxy".to_string(),
        "925-675-9878".to_string(),
        "venmo: 9819410398".to_string(),
        "Brandon Belt".to_string(),
    );
    log::debug!("Benching make_header with new_header: {:?}", new_header);
    let html_header = test::black_box(new_header.make_header());
    log::info!("Made html header: {}", html_header);
    log::debug!("Benching make_gen...");
    test::black_box(violetj2p::gen::make_gen(html_header, "etc/header_bench.pdf").unwrap());
    let runtime = start.elapsed();

    println!("\n");
    log::info!("Time elapsed in both make_header and make_gen functions: {:?}", runtime)
}
