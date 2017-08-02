import { notificationManager } from './index.js';
import * as uuid from 'uuid';
import * as fuzzer from 'JavaScript-fuzz';
import { generateRandomJS } from 'eslump';

describe('notificationManager methods', function () {
    let sandbox;
    beforeEach(function () {
        sandbox = sinon.sandbox.create();
    });
    afterEach(() => {
        sandbox.restore()
        let list = notificationManager.list();
        for (let i = 0; i <= Object.keys(list).length; i++) {
            notificationManager.remove(Object.keys(list)[i]);
        }
    });
    it('//1) Should have an add method', function () {
        expect(notificationManager.add).to.be.defined;
        expect(typeof notificationManager.add).to.equal('function');
    });
    it('//1) Should have a remove method', function () {
        expect(notificationManager.remove).to.be.defined;
        expect(typeof notificationManager.remove).to.equal('function');
    });
    it('//1) Should have a list method', function () {
        expect(notificationManager.list).to.be.defined;
        expect(typeof notificationManager.list).to.equal('function');
    });
    describe('add method', function () {
        it('Should return {}', function () {
            expect(notificationManager.list()).to.deep.equal({});
        });
        let mockData;
        for (let i = 0; i <= 50; i++) {
            mockData = fuzzer.string();
            it(`Should return item with ${mockData}`, function () {
                const mockId = uuid.v4();
                let result = notificationManager.add(mockId, mockData);
                expect(Object.keys(notificationManager.list()[mockId]).length).to.equal(2);
                expect(notificationManager.list()[mockId].copy).to.equal(mockData);
                expect(typeof notificationManager.list()[mockId].time).to.equal('number');
            });
        };
    });
    describe('remove method', function () {
        it('list should return empty', function () {
            expect(notificationManager.list()).to.deep.equal({});
            expect(typeof notificationManager.list()).to.deep.equal('object');
        });
        let mockData;
        for (let i = 0; i <= 50; i++) {
            mockData = fuzzer.string();
            it(`list should be empty after ${mockData} item creation`, function () {
                const mockId = uuid.v4();
                let result = notificationManager.add(mockId, mockData);
                notificationManager.remove(mockId);
                expect(Object.keys(notificationManager.list()).length).to.equal(0);
                expect(typeof notificationManager.list()).to.deep.equal('object');
                expect(notificationManager.list()).to.deep.equal({});
            });
        };
    });
    describe('list method', function () {
        it('Should return {}', function () {
            let result = notificationManager.list();
            expect(result).to.deep.equal({});
        });
    });
});
    